import type { FastifyInstance } from 'fastify'
import type {
  DataRoomFolderType,
  DataRoomAccessLevel,
  DataRoomDocument,
  DataRoomLpAccess,
  DataRoomEngagement,
} from '@arca/shared'
import { DATA_ROOM_FOLDER_LABELS } from '@arca/shared'

// ── In-memory stores (until DB is connected) ────────────────────────

const documents: DataRoomDocument[] = []
const lpAccess: DataRoomLpAccess[] = []
const engagement: DataRoomEngagement[] = []

// ── Routes ──────────────────────────────────────────────────────────

export async function dataRoomRoutes(app: FastifyInstance) {
  // ── Folder Structure ────────────────────────────────────────────

  app.get('/api/v1/dataroom/folders', async () => {
    const folders = Object.entries(DATA_ROOM_FOLDER_LABELS).map(([type, label]) => {
      const folderDocs = documents.filter((d) => d.folderType === type)
      return {
        type,
        label,
        documentCount: folderDocs.length,
        latestUpdate: folderDocs.length
          ? folderDocs.reduce((latest, d) => (d.updatedAt > latest ? d.updatedAt : latest), folderDocs[0].updatedAt)
          : null,
      }
    })
    return { data: folders }
  })

  // ── Document CRUD ───────────────────────────────────────────────

  app.get('/api/v1/dataroom/documents', async (request) => {
    const { folderType } = request.query as { folderType?: DataRoomFolderType }
    let filtered = documents
    if (folderType) filtered = filtered.filter((d) => d.folderType === folderType)
    return { data: filtered }
  })

  app.get('/api/v1/dataroom/documents/:documentId', async (request) => {
    const { documentId } = request.params as { documentId: string }
    const doc = documents.find((d) => d.id === documentId)
    if (!doc) return { error: 'Not found', message: 'Document not found', statusCode: 404 }

    const docAccess = lpAccess.filter((a) => a.documentId === documentId)
    const docEngagement = engagement.filter((e) => e.documentName === doc.name)

    return { data: { document: doc, access: docAccess, engagement: docEngagement } }
  })

  app.post('/api/v1/dataroom/documents', async (request) => {
    const body = request.body as {
      folderType: DataRoomFolderType
      name: string
      fileName: string
    }

    const doc: DataRoomDocument = {
      id: crypto.randomUUID(),
      folderId: body.folderType,
      folderType: body.folderType,
      name: body.name,
      fileName: body.fileName,
      fileSize: null,
      mimeType: null,
      version: 1,
      uploadedBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    documents.push(doc)
    return { data: doc }
  })

  app.patch('/api/v1/dataroom/documents/:documentId', async (request) => {
    const { documentId } = request.params as { documentId: string }
    const body = request.body as {
      name?: string
      fileName?: string
      version?: number
    }

    const idx = documents.findIndex((d) => d.id === documentId)
    if (idx < 0) return { error: 'Not found', message: 'Document not found', statusCode: 404 }

    documents[idx] = {
      ...documents[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return { data: documents[idx] }
  })

  app.delete('/api/v1/dataroom/documents/:documentId', async (request) => {
    const { documentId } = request.params as { documentId: string }
    const idx = documents.findIndex((d) => d.id === documentId)
    if (idx < 0) return { error: 'Not found', message: 'Document not found', statusCode: 404 }

    documents.splice(idx, 1)
    return { status: 'ok' }
  })

  // ── LP Access Management ────────────────────────────────────────

  app.get('/api/v1/dataroom/access', async (request) => {
    const { lpId, documentId } = request.query as { lpId?: string; documentId?: string }
    let filtered = lpAccess
    if (lpId) filtered = filtered.filter((a) => a.lpId === lpId)
    if (documentId) filtered = filtered.filter((a) => a.documentId === documentId)
    return { data: filtered }
  })

  app.post('/api/v1/dataroom/access', async (request) => {
    const body = request.body as {
      lpId: string
      documentId?: string
      folderType?: DataRoomFolderType
      accessLevel: DataRoomAccessLevel
      ndaRequired?: boolean
      expiresAt?: string
    }

    const access: DataRoomLpAccess = {
      id: crypto.randomUUID(),
      lpId: body.lpId,
      documentId: body.documentId ?? null,
      folderType: body.folderType ?? null,
      accessLevel: body.accessLevel,
      ndaRequired: body.ndaRequired ?? true,
      ndaSignedAt: null,
      expiresAt: body.expiresAt ?? null,
      grantedBy: 'system',
      createdAt: new Date().toISOString(),
    }
    lpAccess.push(access)
    return { data: access }
  })

  app.patch('/api/v1/dataroom/access/:accessId', async (request) => {
    const { accessId } = request.params as { accessId: string }
    const body = request.body as {
      accessLevel?: DataRoomAccessLevel
      ndaSignedAt?: string
      expiresAt?: string
    }

    const idx = lpAccess.findIndex((a) => a.id === accessId)
    if (idx < 0) return { error: 'Not found', message: 'Access record not found', statusCode: 404 }

    lpAccess[idx] = { ...lpAccess[idx], ...body }
    return { data: lpAccess[idx] }
  })

  app.delete('/api/v1/dataroom/access/:accessId', async (request) => {
    const { accessId } = request.params as { accessId: string }
    const idx = lpAccess.findIndex((a) => a.id === accessId)
    if (idx < 0) return { error: 'Not found', message: 'Access record not found', statusCode: 404 }

    lpAccess.splice(idx, 1)
    return { status: 'ok' }
  })

  // ── Engagement Analytics ────────────────────────────────────────

  app.get('/api/v1/dataroom/engagement', async (request) => {
    const { lpId } = request.query as { lpId?: string }
    let filtered = engagement
    if (lpId) filtered = filtered.filter((e) => e.lpId === lpId)
    return { data: filtered }
  })

  // ── Dashboard Stats ─────────────────────────────────────────────

  app.get('/api/v1/dataroom/dashboard', async () => {
    const totalDocuments = documents.length
    const byFolder: Record<string, number> = {}
    for (const doc of documents) {
      byFolder[doc.folderType] = (byFolder[doc.folderType] ?? 0) + 1
    }

    const totalLpsWithAccess = new Set(lpAccess.map((a) => a.lpId)).size
    const pendingNdas = lpAccess.filter((a) => a.ndaRequired && !a.ndaSignedAt).length

    const recentEngagement = engagement
      .filter((e) => e.lastViewedAt)
      .sort((a, b) => (b.lastViewedAt ?? '').localeCompare(a.lastViewedAt ?? ''))
      .slice(0, 10)

    return {
      data: {
        totalDocuments,
        byFolder,
        totalLpsWithAccess,
        pendingNdas,
        recentEngagement,
      },
    }
  })
}
