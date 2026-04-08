/**
 * DocSend Advanced integration service.
 *
 * DocSend is used for the LP data room — secure document sharing with
 * per-LP permissions, NDA gating, watermarking, and engagement analytics.
 *
 * Environment variables:
 *   DOCSEND_API_KEY    - API key for authentication
 *   DOCSEND_API_URL    - Base URL (default: https://api.docsend.com/v1)
 *   DOCSEND_SPACE_ID   - Primary data room space ID (set after setup)
 */

// ── Types ───────────────────────────────────────────────────────────

export interface DocSendConfig {
  apiKey: string
  baseUrl: string
  spaceId?: string
}

export interface DocSendSpace {
  id: string
  name: string
  description: string
  isPublic: boolean
  requireNda: boolean
  watermarkEnabled: boolean
  createdAt: string
}

export interface DocSendDocument {
  id: string
  spaceId: string
  name: string
  folder: string
  fileType: string
  pageCount: number
  version: number
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface DocSendFolder {
  id: string
  spaceId: string
  name: string
  parentFolderId: string | null
  sortOrder: number
  documentCount: number
  createdAt: string
}

export interface DocSendLink {
  id: string
  documentId: string | null
  spaceId: string | null
  url: string
  recipientEmail: string
  recipientName: string
  requireEmail: boolean
  requireNda: boolean
  allowDownload: boolean
  expiresAt: string | null
  passcode: string | null
  isActive: boolean
  createdAt: string
}

export interface DocSendVisit {
  id: string
  linkId: string
  visitorEmail: string
  visitorName: string | null
  duration: number
  pageViews: DocSendPageView[]
  completionRate: number
  downloadedAt: string | null
  ndaSignedAt: string | null
  visitedAt: string
}

export interface DocSendPageView {
  pageNumber: number
  duration: number
  viewedAt: string
}

export interface DocSendAnalytics {
  documentId: string
  totalVisits: number
  uniqueVisitors: number
  avgDuration: number
  avgCompletionRate: number
  downloadCount: number
  topPages: { pageNumber: number; avgDuration: number }[]
}

// ── Client ──────────────────────────────────────────────────────────

export function createDocSendClient(config: DocSendConfig) {
  const { apiKey, baseUrl, spaceId } = config

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const errorBody = await res.text()
      throw new Error(`DocSend API error ${res.status}: ${errorBody}`)
    }

    return res.json() as Promise<T>
  }

  function requireSpaceId(): string {
    if (!spaceId) throw new Error('DOCSEND_SPACE_ID is required for this operation')
    return spaceId
  }

  return {
    // ── Space (Data Room) Operations ──────────────────────────────

    async getSpace(): Promise<DocSendSpace> {
      return request<DocSendSpace>('GET', `/spaces/${requireSpaceId()}`)
    },

    async listSpaces(): Promise<DocSendSpace[]> {
      return request<DocSendSpace[]>('GET', '/spaces')
    },

    async updateSpace(updates: {
      name?: string
      description?: string
      requireNda?: boolean
      watermarkEnabled?: boolean
    }): Promise<DocSendSpace> {
      return request<DocSendSpace>('PATCH', `/spaces/${requireSpaceId()}`, updates)
    },

    // ── Folder Operations ─────────────────────────────────────────

    async createFolder(payload: {
      name: string
      parentFolderId?: string
    }): Promise<DocSendFolder> {
      return request<DocSendFolder>('POST', `/spaces/${requireSpaceId()}/folders`, payload)
    },

    async listFolders(): Promise<DocSendFolder[]> {
      return request<DocSendFolder[]>('GET', `/spaces/${requireSpaceId()}/folders`)
    },

    // ── Document Operations ───────────────────────────────────────

    async listDocuments(folderId?: string): Promise<DocSendDocument[]> {
      const query = folderId ? `?folderId=${folderId}` : ''
      return request<DocSendDocument[]>('GET', `/spaces/${requireSpaceId()}/documents${query}`)
    },

    async getDocument(documentId: string): Promise<DocSendDocument> {
      return request<DocSendDocument>('GET', `/documents/${documentId}`)
    },

    async deleteDocument(documentId: string): Promise<void> {
      await request<void>('DELETE', `/documents/${documentId}`)
    },

    // ── Link Management (per-LP access) ───────────────────────────

    async createLink(payload: {
      documentId?: string
      spaceId?: string
      recipientEmail: string
      recipientName: string
      requireEmail?: boolean
      requireNda?: boolean
      allowDownload?: boolean
      expiresAt?: string
      passcode?: string
    }): Promise<DocSendLink> {
      return request<DocSendLink>('POST', '/links', {
        ...payload,
        spaceId: payload.spaceId ?? requireSpaceId(),
      })
    },

    async listLinks(): Promise<DocSendLink[]> {
      return request<DocSendLink[]>('GET', `/spaces/${requireSpaceId()}/links`)
    },

    async revokeLink(linkId: string): Promise<DocSendLink> {
      return request<DocSendLink>('PATCH', `/links/${linkId}`, { isActive: false })
    },

    // ── Analytics ─────────────────────────────────────────────────

    async getDocumentAnalytics(documentId: string): Promise<DocSendAnalytics> {
      return request<DocSendAnalytics>('GET', `/documents/${documentId}/analytics`)
    },

    async getVisits(linkId: string): Promise<DocSendVisit[]> {
      return request<DocSendVisit[]>('GET', `/links/${linkId}/visits`)
    },

    async getSpaceAnalytics(): Promise<{
      totalVisits: number
      uniqueVisitors: number
      avgEngagementTime: number
      documents: DocSendAnalytics[]
    }> {
      return request('GET', `/spaces/${requireSpaceId()}/analytics`)
    },
  }
}

// ── Factory ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createDocSendClient> | null = null

export function getDocSendClient(): ReturnType<typeof createDocSendClient> {
  if (!_client) {
    const apiKey = process.env.DOCSEND_API_KEY
    if (!apiKey) {
      throw new Error('DOCSEND_API_KEY environment variable is required')
    }
    _client = createDocSendClient({
      apiKey,
      baseUrl: process.env.DOCSEND_API_URL ?? 'https://api.docsend.com/v1',
      spaceId: process.env.DOCSEND_SPACE_ID,
    })
  }
  return _client
}
