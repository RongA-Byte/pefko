/**
 * Affinity CRM integration service.
 *
 * Affinity is a relationship-intelligence CRM selected for ARCA's deal flow
 * and LP tracking pipelines. This module wraps Affinity's REST API (v2) for
 * list management, organization/person lookups, field-value updates, and
 * relationship-graph queries.
 *
 * Environment variables:
 *   AFFINITY_API_KEY          - API key (used as Basic auth password)
 *   AFFINITY_API_URL          - Base URL (default: https://api.affinity.co)
 *   AFFINITY_DEAL_LIST_ID     - List ID for deal flow pipeline
 *   AFFINITY_LP_LIST_ID       - List ID for LP tracking pipeline
 */

// ── Types ───────────────────────────────────────────────────────────

export interface AffinityConfig {
  apiKey: string
  baseUrl: string
  dealListId?: string
  lpListId?: string
}

export interface AffinityList {
  id: number
  type: number
  name: string
  public: boolean
  owner_id: number
  list_size: number
}

export interface AffinityOrganization {
  id: number
  name: string
  domain: string | null
  domains: string[]
  global: boolean
  person_ids: number[]
  opportunity_ids: number[]
}

export interface AffinityPerson {
  id: number
  type: number
  first_name: string
  last_name: string
  primary_email: string | null
  emails: string[]
  organization_ids: number[]
}

export interface AffinityListEntry {
  id: number
  list_id: number
  creator_id: number
  entity_id: number
  entity_type: number // 0 = person, 1 = organization, 8 = opportunity
  created_at: string
}

export interface AffinityFieldValue {
  id: number
  field_id: number
  entity_id: number
  list_entry_id: number | null
  value: unknown
  value_type: number
}

export interface AffinityField {
  id: number
  name: string
  list_id: number | null
  value_type: number // 0=person, 1=org, 2=dropdown, 3=number, 4=date, 5=location, 6=text, 7=ranked-dropdown
  allows_multiple: boolean
  dropdown_options?: AffinityDropdownOption[]
}

export interface AffinityDropdownOption {
  id: number
  text: string
  rank: number | null
  color: number
}

export interface AffinityRelationshipStrength {
  internal_id: number
  external_id: number
  direction: 'incoming' | 'outgoing' | 'both'
  strength: number // 0-5
  first_email_date: string | null
  last_email_date: string | null
  last_event_date: string | null
  num_emails: number
  num_events: number
}

export interface AffinityNote {
  id: number
  creator_id: number
  parent_id: number
  parent_type: number
  content: string
  created_at: string
}

// ── Client ──────────────────────────────────────────────────────────

export function createAffinityClient(config: AffinityConfig) {
  const { apiKey, baseUrl, dealListId, lpListId } = config

  // Affinity uses Basic auth with empty username and API key as password
  const authHeader = `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const errorBody = await res.text()
      throw new Error(`Affinity API error ${res.status}: ${errorBody}`)
    }

    return res.json() as Promise<T>
  }

  function requireDealListId(): string {
    if (!dealListId) throw new Error('AFFINITY_DEAL_LIST_ID is required for deal pipeline operations')
    return dealListId
  }

  function requireLpListId(): string {
    if (!lpListId) throw new Error('AFFINITY_LP_LIST_ID is required for LP pipeline operations')
    return lpListId
  }

  return {
    // ── Lists ───────────────────────────────────────────────────────

    async getLists(): Promise<AffinityList[]> {
      return request<AffinityList[]>('GET', '/lists')
    },

    async getList(listId: number): Promise<AffinityList> {
      return request<AffinityList>('GET', `/lists/${listId}`)
    },

    async getListFields(listId: number): Promise<AffinityField[]> {
      return request<AffinityField[]>('GET', `/lists/${listId}/fields`)
    },

    // ── Deal Pipeline ───────────────────────────────────────────────

    async listDealEntries(params?: {
      page_size?: number
      page_token?: string
    }): Promise<{ list_entries: AffinityListEntry[]; next_page_token: string | null }> {
      const qs = new URLSearchParams()
      if (params?.page_size) qs.set('page_size', String(params.page_size))
      if (params?.page_token) qs.set('page_token', params.page_token)
      const query = qs.toString() ? `?${qs.toString()}` : ''
      return request('GET', `/lists/${requireDealListId()}/list-entries${query}`)
    },

    async createDealEntry(entityId: number): Promise<AffinityListEntry> {
      return request<AffinityListEntry>('POST', `/lists/${requireDealListId()}/list-entries`, {
        entity_id: entityId,
      })
    },

    async deleteDealEntry(listEntryId: number): Promise<{ success: boolean }> {
      return request('DELETE', `/list-entries/${listEntryId}`)
    },

    // ── LP Pipeline ─────────────────────────────────────────────────

    async listLpEntries(params?: {
      page_size?: number
      page_token?: string
    }): Promise<{ list_entries: AffinityListEntry[]; next_page_token: string | null }> {
      const qs = new URLSearchParams()
      if (params?.page_size) qs.set('page_size', String(params.page_size))
      if (params?.page_token) qs.set('page_token', params.page_token)
      const query = qs.toString() ? `?${qs.toString()}` : ''
      return request('GET', `/lists/${requireLpListId()}/list-entries${query}`)
    },

    async createLpEntry(entityId: number): Promise<AffinityListEntry> {
      return request<AffinityListEntry>('POST', `/lists/${requireLpListId()}/list-entries`, {
        entity_id: entityId,
      })
    },

    // ── Organizations ───────────────────────────────────────────────

    async searchOrganizations(term: string): Promise<AffinityOrganization[]> {
      return request<AffinityOrganization[]>('GET', `/organizations?term=${encodeURIComponent(term)}`)
    },

    async getOrganization(orgId: number): Promise<AffinityOrganization> {
      return request<AffinityOrganization>('GET', `/organizations/${orgId}`)
    },

    async createOrganization(payload: {
      name: string
      domain?: string
      person_ids?: number[]
    }): Promise<AffinityOrganization> {
      return request<AffinityOrganization>('POST', '/organizations', payload)
    },

    // ── Persons ─────────────────────────────────────────────────────

    async searchPersons(term: string): Promise<AffinityPerson[]> {
      return request<AffinityPerson[]>('GET', `/persons?term=${encodeURIComponent(term)}`)
    },

    async getPerson(personId: number): Promise<AffinityPerson> {
      return request<AffinityPerson>('GET', `/persons/${personId}`)
    },

    async createPerson(payload: {
      first_name: string
      last_name: string
      emails: string[]
      organization_ids?: number[]
    }): Promise<AffinityPerson> {
      return request<AffinityPerson>('POST', '/persons', payload)
    },

    // ── Field Values ────────────────────────────────────────────────

    async getFieldValues(params: {
      person_id?: number
      organization_id?: number
      opportunity_id?: number
      list_entry_id?: number
    }): Promise<AffinityFieldValue[]> {
      const qs = new URLSearchParams()
      if (params.person_id) qs.set('person_id', String(params.person_id))
      if (params.organization_id) qs.set('organization_id', String(params.organization_id))
      if (params.opportunity_id) qs.set('opportunity_id', String(params.opportunity_id))
      if (params.list_entry_id) qs.set('list_entry_id', String(params.list_entry_id))
      return request<AffinityFieldValue[]>('GET', `/field-values?${qs.toString()}`)
    },

    async setFieldValue(payload: {
      field_id: number
      entity_id: number
      value: unknown
      list_entry_id?: number
    }): Promise<AffinityFieldValue> {
      return request<AffinityFieldValue>('POST', '/field-values', payload)
    },

    async updateFieldValue(
      fieldValueId: number,
      value: unknown,
    ): Promise<AffinityFieldValue> {
      return request<AffinityFieldValue>('PUT', `/field-values/${fieldValueId}`, { value })
    },

    async deleteFieldValue(fieldValueId: number): Promise<{ success: boolean }> {
      return request('DELETE', `/field-values/${fieldValueId}`)
    },

    // ── Relationship Intelligence ───────────────────────────────────

    async getRelationshipStrengths(params: {
      internal_id?: number
      external_id?: number
    }): Promise<AffinityRelationshipStrength[]> {
      const qs = new URLSearchParams()
      if (params.internal_id) qs.set('internal_id', String(params.internal_id))
      if (params.external_id) qs.set('external_id', String(params.external_id))
      return request<AffinityRelationshipStrength[]>('GET', `/relationship-strengths?${qs.toString()}`)
    },

    // ── Notes ───────────────────────────────────────────────────────

    async listNotes(params: {
      person_id?: number
      organization_id?: number
      opportunity_id?: number
    }): Promise<AffinityNote[]> {
      const qs = new URLSearchParams()
      if (params.person_id) qs.set('person_id', String(params.person_id))
      if (params.organization_id) qs.set('organization_id', String(params.organization_id))
      if (params.opportunity_id) qs.set('opportunity_id', String(params.opportunity_id))
      return request<AffinityNote[]>('GET', `/notes?${qs.toString()}`)
    },

    async createNote(payload: {
      person_id?: number
      organization_id?: number
      opportunity_id?: number
      content: string
    }): Promise<AffinityNote> {
      return request<AffinityNote>('POST', '/notes', payload)
    },
  }
}

// ── Factory ─────────────────────────────────────────────────────────

let _client: ReturnType<typeof createAffinityClient> | null = null

export function getAffinityClient(): ReturnType<typeof createAffinityClient> {
  if (!_client) {
    const apiKey = process.env.AFFINITY_API_KEY
    if (!apiKey) {
      throw new Error('AFFINITY_API_KEY environment variable is required')
    }
    _client = createAffinityClient({
      apiKey,
      baseUrl: process.env.AFFINITY_API_URL ?? 'https://api.affinity.co',
      dealListId: process.env.AFFINITY_DEAL_LIST_ID,
      lpListId: process.env.AFFINITY_LP_LIST_ID,
    })
  }
  return _client
}
