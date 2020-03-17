// tslint:disable max-file-line-count no-duplicate-string
import {
  NominationFilter,
  SegmentOrg,
  CountryCode,
  Cluster,
  Region,
  NomineeJobLevel,
  Vertical,
  ImportantProducts,
  SubSegment,
  ProductFocus,
  Sector,
  Program,
  VerticalTrack,
  NominationDefjamStatus,
  EventType,
  NominationType,
} from '../../../../../../../components'
import { ToolStatusHelper, ToolStatudFilterQueryItem } from '../../../../../../../core/utils'

interface SegmentFilter {
  $or: [
    { 'bookOfBusiness.bcSegmentName': { $in: string[] } },
    { 'bookOfBusiness.gmlSegmentName': { $in: string[] } },
    { 'bookOfBusiness.countryCodeSegmentName': { $in: string[] } },
  ]
}

interface FilterProps {
  'bookOfBusiness.org': { $in: SegmentOrg[] }
  'bookOfBusiness.country': { $in: CountryCode[] }
  'bookOfBusiness.cluster': { $in: Cluster[] }
  'bookOfBusiness.region': { $in: Region[] }
  'bookOfBusiness.isPremier': boolean
  'company.isCompetitor': boolean
  productFocus: { $in: ProductFocus[] }
  segment: { $in: string[] }
  nomineeJobLevel: { $in: NomineeJobLevel[] }
  clientAdminEmail: string
  nda: boolean
  'bookOfBusiness.vertical': { $in: Vertical[] }
  'bookOfBusiness.sector': { $in: Sector[] } | { $or: [ { $in: Sector[] }, { $not: { $in: Sector[] }}]}
  'bookOfBusiness.program': { $in: Program[] }
  verticalTrack: { $in: VerticalTrack[] }
  'bookOfBusiness.parentCompany': boolean
  importantProducts: { $in: ImportantProducts[] }
  openSeats: boolean
  subscribed: boolean
  subSegment: { $in: SubSegment[] }
  defJamStatus?: { $in: NominationDefjamStatus[] }
  eventType?: { $in: EventType[] }
  eventHasAudDevList?: boolean
  nominationType?: { $in: NominationType[] }
  swapRequestedAt?: { $exists: boolean }
}

type QueryFilter = FilterProps & SegmentFilter

export const addFilters = (
  toolStatusHelper: ToolStatusHelper,
  filter?: NominationFilter,
): Partial<QueryFilter> => {
  if (typeof filter === 'undefined') {
    return {}
  }
  return {
    ...addFilterClientAdminEmail(filter),
    ...addFilterClientLevel(filter),
    ...addFilterCluster(filter),
    ...addFilterCountry(filter),
    ...addFilterImportantProducts(filter),
    ...addFilterIsCompetitor(filter),
    ...addFilterIsPremier(filter),
    ...addFilterNda(filter),
    ...addFilterOrg(filter),
    ...addFilterProductFocus(filter),
    ...addFilterProgram(filter),
    ...addFilterRegion(filter),
    ...addFilterSector(filter),
    ...addFilterSegment(filter),
    ...addFilterSubSegment(filter),
    ...addFilterToolStatus(toolStatusHelper, filter),
    ...addFilterVertical(filter),
    ...addFilterVerticalTrack(filter),
  }
}

const addFilterClientAdminEmail = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.clientAdminEmail === 'undefined') {
    return {}
  }
  return {
    clientAdminEmail: filter.clientAdminEmail,
  }
}

const addFilterClientLevel = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.clientLevel === 'undefined') {
    return {}
  }
  return {
    nomineeJobLevel: { $in: filterValueAsArray(filter.clientLevel) },
  }
}

const addFilterCluster = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.cluster === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.cluster':  { $in: filterValueAsArray(filter.cluster) },
  }
}

const addFilterCountry = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.country === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.country':  { $in: filterValueAsArray(filter.country) },
  }
}

const addFilterImportantProducts = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.importantProducts === 'undefined') {
    return {}
  }
  return {
    importantProducts: { $in: filterValueAsArray(filter.importantProducts) },
  }
}

const addFilterIsCompetitor = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.competitor === 'undefined') {
    return {}
  }
  return {
    'company.isCompetitor': filter.competitor,
  }
}

const addFilterIsPremier = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.premier === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.isPremier': filter.premier,
  }
}

const addFilterNda = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.nda === 'undefined') {
    return {}
  }
  return {
    nda: filter.nda,
  }
}

const addFilterOrg = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.org === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.org': { $in: filterValueAsArray(filter.org) },
  }
}

const addFilterProductFocus = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.productFocus === 'undefined') {
    return {}
  }
  return {
    productFocus: { $in: filterValueAsArray(filter.productFocus) },
  }
}

const addFilterProgram = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.program === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.program': { $in: filterValueAsArray(filter.program) },
  }
}

const addFilterRegion = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.region === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.region': { $in: filterValueAsArray(filter.region) },
  }
}

const addFilterSector = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.sector === 'undefined') {
    return {}
  }
  const sectors = filterValueAsArray(filter.sector)
  if (sectors.includes(Sector.OTHER)) {
    const withoutOther = sectors.splice(sectors.findIndex((item) => item === Sector.OTHER), 1)
    return {
      'bookOfBusiness.sector': {
        $or: [
          { $in: withoutOther },
          { $not: { $in: [
            Sector.CG_AND_E,
            Sector.GCAS,
            Sector.GCS,
            Sector.GLOBAL_PARTNERSHIP,
            Sector.IS,
            Sector.MCS,
            Sector.PLATFORMS,
            Sector.SDS,
            Sector.US_AGENCY,
          ] } },
        ],
      },
    }
  }
  return {
    'bookOfBusiness.sector': { $in: sectors },
  }
}

const addFilterSegment = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.segment === 'undefined') {
    return {}
  }
  return {
    $or: [
      { 'bookOfBusiness.bcSegmentName': { $in: filterValueAsArray(filter.segment) } },
      { 'bookOfBusiness.gmlSegmentName': { $in: filterValueAsArray(filter.segment) } },
      { 'bookOfBusiness.countryCodeSegmentName': { $in: filterValueAsArray(filter.segment) } },
    ],
  }
}

const addFilterSubSegment = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.subSegment === 'undefined') {
    return {}
  }
  return {
    subSegment: { $in: filterValueAsArray(filter.subSegment) },
  }
}

const addFilterToolStatus = (
  toolStatusHelper: ToolStatusHelper,
  filter: NominationFilter,
): any => { // tslint:disable-line no-any -- TODO: FIX TYPING
  if (typeof filter.toolStatus === 'undefined') {
    return {}
  }
  const toolStatusFilter = toolStatusHelper.getFilterQueryForToolStatus(filterValueAsArray(filter.toolStatus))
  if (toolStatusFilter.length === 0) {
    return {}
  }
  const filterItem: {
    $or: Array<{ $or: ToolStatudFilterQueryItem[] }>,
  } = {
    $or: [],
  }
  for (const toolStatusFilterItem of toolStatusFilter) {
    const currentFilterItem: {
      $or: ToolStatudFilterQueryItem[],
    } = {
      $or: [],
    }
    for (const toolStatusFilterItemItem of toolStatusFilterItem) {
      currentFilterItem.$or.push(toolStatusFilterItemItem)
    }
    filterItem.$or.push(currentFilterItem)
  }
  return filterItem
}

const addFilterVertical = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.vertical === 'undefined') {
    return {}
  }
  return {
    'bookOfBusiness.vertical': { $in: filterValueAsArray(filter.vertical) },
  }
}

const addFilterVerticalTrack = (filter: NominationFilter): Partial<QueryFilter> => {
  if (typeof filter.verticalTrack === 'undefined') {
    return {}
  }
  return {
    verticalTrack: { $in: filterValueAsArray(filter.verticalTrack) },
  }
}

const filterValueAsArray = <T>(value: T | T[]): T[] => {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}
