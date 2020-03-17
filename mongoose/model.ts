import { NominationDTO } from '../../../../../../components/nomination/entity'
import mongoose, { Schema, Document } from 'mongoose'

export interface NominationModel extends Document, Omit<NominationDTO , 'id'> {}

const schema = new Schema<NominationModel>({
  aeAm: { type: String, required: false },
  agencyCompany: { type: Object, required: false },
  agencyCompanyId: { type: String, required: false },
  approvedAt: { type: Number, required: false },
  appStatus: { type: String, required: true },
  bookOfBusiness: { type: Object, required: false },
  businessJustification: { type: String, required: false },
  childHoldCo: { type: String, required: false },
  clientAdminEmail: { type: String, required: false },
  company: { type: Object, required: true },
  companyId: { type: String, required: true },
  companyNameLowerCase: { type: String, required: true },
  countryCode: { type: String, required: false },
  createdAt: { type: Number, required: true },
  djStatus: { type: String, required: true },
  djStatusLastUpdated: { type: Number, required: true },
  eventId: { type: String, required: true },
  eventType: { type: String, required: true },
  gContractsLink: { type: String, required: false },
  governmentOfficial: { type: Boolean, required: false },
  importantProducts: { type: [String], required: false, default: undefined },
  lcId: { type: String, required: false },
  nda: { type: Boolean, required: false },
  nominationType: { type: String, required: true },
  nominator: { type: Object, required: true },
  nominatorId: { type: String, required: true },
  nomineeEmail: { type: String, required: true },
  nomineeFirstName: { type: String, required: true },
  nomineeId: { type: String, required: true },
  nomineeJobLevel: { type: String, required: true },
  nomineeJobTitle: { type: String, required: true },
  nomineeLastName: { type: String, required: true },
  priorityGooglersToCc: { type: [String], required: false, default: undefined },
  productFocus: { type: String, required: false },
  rejectedAt: { type: Number, required: false },
  rejectionReason: { type: String, required: false },
  sector: { type: String, required: false },
  segmentName: { type: String, required: true },
  subscriptions: { type: [Object], required: true },
  subSegment: { type: String, required: false },
  swappedAt: { type: Number, required: false },
  swappedNomination: { type: Object, required: false },
  swappedNominationId: { type: String, required: false },
  swapRequestedAt: { type: Number, required: false },
  team: { type: Object, required: false },
  teamId: { type: String, required: false },
  updatedAt: { type: Number, required: true },
  vertical: { type: String, required: false },
  verticalTrack: { type: String, required: false },
})
schema.index({ appStatus: 1 })
schema.index({ companyId: 1 })
schema.index({ companyNameLowerCase: 'text' })
schema.index({ countryCode: 1 })
schema.index({ djStatus: 1 })
schema.index({ djStatusLastUpdated: 1 })
schema.index({ eventId: 1 })
schema.index({ nominationType: 1 })
schema.index({ nominatorId: 1 })
schema.index({ nomineeEmail: 1 })
schema.index({ teamId: 1 })
schema.index({ segmentName: 1 })

export const makeNominationModel = (
  conn: mongoose.Connection,
) => conn.model<NominationModel>('Nomination', schema)
