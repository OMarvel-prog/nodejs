// tslint:disable no-duplicate-string
import { GetNominationsForApprovalRepository } from '../../../../../../../components/nomination/use-cases/get-nominations-for-approval/get-nominations-for-approval.repository.def'
import { GetNominationsForApprovalOutItem } from '../../../../../../../components/nomination/use-cases/get-nominations-for-approval/get-nominations-for-approval.out.def'
import { ApproverQueue } from '../../../../../../../components/nomination/entity/approver-queue.enum'
import { UserDTO } from '../../../../../../../components/user/entity/user.dto.def'
import { NominationAppStatus } from '../../../../../../../components/nomination/entity/nomination-app-status'
import { ApproverType } from '../../../../../../../components/role/entity/approver-type.enum'
import { RoleStatus } from '../../../../../../../components/role/entity/role-status.enum'
import { RoleType } from '../../../../../../../components/role/entity/role-type.enum'
import { NominationType } from '../../../../../../../components/nomination/entity/nomination-type'
import { NominationFilter } from '../../../../../../../components/nomination/entity/nomination-filter.def'
import { MongodbManager } from '../../../../../../../frameworks/db/mongoose/mongodb-manager.def'
import { addFilters } from './get-nominations-for-approval-filter'
import { ToolStatusHelper } from '../../../../../../../core/utils/tool-status/tool-status-helper.def'

export const makeGetNominationsForApprovalRepository = (
  mongodbManager: MongodbManager,
  toolStatusHelper: ToolStatusHelper,
): GetNominationsForApprovalRepository => { // tslint:disable-line no-big-function

  // tslint:disable-next-line max-func-body-length no-big-function
  const getNominationsForApproval = async (
    approverQueue: ApproverQueue,
    approver: UserDTO,
    limit: number,
    skip: number,
    filter?: NominationFilter,
  ): Promise<GetNominationsForApprovalOutItem[]> => {
    const { types, segmentNames } = await getUserRoleProps(approver)
    const nominationTypes = getNominationTypes(approverQueue, types)
    const nominationStatuses = getNominationStatusForApproverQueue(approverQueue)
    if (nominationTypes.length === 0) {
      return []
    }
    return mongodbManager.nominationModel
      .aggregate([
        { $match:
          {
            ...addFilters(toolStatusHelper, filter),
            appStatus: { $in: nominationStatuses },
            nominationType: { $in: nominationTypes },
            segmentName: { $in: segmentNames },
          },
        },
        { $sort: { createdAt: 1 }},
        { $limit: limit },
        { $skip: skip },
        { $set:
          {
            companyObjectId: '$companyId',
            id: '$_id',
            nominatorObjectId: '$nominatorId',
            swappedNominationObjectId: { $toObjectId: '$swappedNominationId' },
            teamObjectId: '$teamId',
          },
        },
        { $lookup:
          {
            as: 'company',
            foreignField: '_id',
            from: 'companies',
            localField: 'companyObjectId',
          },
        },
        { $lookup:
          {
            as: 'team',
            foreignField: '_id',
            from: 'teams',
            localField: 'teamObjectId',
          },
        },
        { $lookup:
          {
            as: 'nominator',
            foreignField: '_id',
            from: 'users',
            localField: 'nominatorObjectId',
          },
        },
        { $lookup:
          {
            as: 'swappedNomination',
            foreignField: '_id',
            from: 'nominations',
            localField: 'swappedNominationObjectId',
          },
        },
        { $set: { swappedNomination: { $arrayElemAt: [ '$swappedNomination', 0 ] } } },
        { $set:
          {
            'swappedNomination.companyObjectId': '$swappedNomination.companyId',
            'swappedNomination.nominatorObjectId': '$swappedNomination.nominatorId',
            'swappedNomination.teamObjectId': '$swappedNomination.teamId',
          },
        },
        { $lookup:
          {
            as: 'swappedNomination.company',
            foreignField: '_id',
            from: 'companies',
            localField: 'swappedNomination.companyObjectId',
          },
        },
        { $lookup:
          {
            as: 'swappedNomination.nominator',
            foreignField: '_id',
            from: 'users',
            localField: 'swappedNomination.nominatorObjectId',
          },
        },
        { $lookup:
          {
            as: 'swappedNomination.team',
            foreignField: '_id',
            from: 'teams',
            localField: 'swappedNomination.teamObjectId',
          },
        },
        { $set:
          {
            company: { $arrayElemAt: [ '$company', 0 ] },
            nominator: { $arrayElemAt: [ '$nominator', 0 ] },
            team: { $arrayElemAt: [ '$team', 0 ] },
          },
        },
        { $set:
          {
            'company.id': '$company._id',
            'nominator.id': '$nominator._id',
            'swappedNomination.company': { $arrayElemAt: [ '$swappedNomination.company', 0 ] },
            'swappedNomination.id': { $toString: '$swappedNomination._id' },
            'swappedNomination.nominator': { $arrayElemAt: [ '$swappedNomination.nominator', 0 ] },
            'swappedNomination.team': { $arrayElemAt: [ '$swappedNomination.team', 0 ] },
            'team.id': '$team._id',
          },
        },
        { $set:
          {
            'swappedNomination.company.id': '$swappedNomination.company._id',
            'swappedNomination.nominator.id': '$swappedNomination.nominator._id',
            'swappedNomination.team.id': '$swappedNomination.team._id',
          },
        },
        {
          $unset:
          [
            '_id',
            '__v',
            'companyObjectId',
            'swappedNominationObjectId',
            'swappedNomination.companyObjectId',
            'swappedNomination.company._id',
            'swappedNomination.company.__v',
            'swappedNomination.nominatorObjectId',
            'swappedNomination.nominator._id',
            'swappedNomination.nominator.__v',
            'swappedNomination.nominator.password',
            'swappedNomination.teamObjectId',
            'swappedNomination.team._id',
            'swappedNomination.team.__v',
            'company._id',
            'company.__v',
            'nominator._id',
            'nominator.__v',
            'nominator.password',
            'swappedNomination._id',
            'swappedNomination.__v',
            'team._id',
            'team.__v',
          ],
        },
      ])
      .exec()
  }

  const getNominationTypes = (approverQueue: ApproverQueue, availableTypes: ApproverType[]): NominationType[] => {
    switch (approverQueue) {
      case ApproverQueue.SWAP: {
        return getNominationTypesForSwap(availableTypes)
      }
      case ApproverQueue.NEW_COMPANIES: {
        return getNominationTypesForNewCompanies(availableTypes)
      }
      case ApproverQueue.ADDITIONAL_ATTENDEES: {
        return getNominationTypesForAdditionalAttendees(availableTypes)
      }
      case ApproverQueue.COMPLETED_REQUESTS: {
        return getNominationTypesForCompletedRequests(availableTypes)
      }
    }
  }

  const getNominationStatusForApproverQueue = (approverQueue: ApproverQueue): NominationAppStatus[] => {
    if (approverQueue === ApproverQueue.COMPLETED_REQUESTS) {
      return [NominationAppStatus.APP_APPROVED, NominationAppStatus.APP_REJECTED]
    }
    return [NominationAppStatus.APP_PENDING]
  }

  const getNominationTypesForSwap = (availableTypes: ApproverType[]): NominationType[] => {
    return availableTypes.includes(ApproverType.SWAP) ? [NominationType.SWAP] : []
  }

  const getNominationTypesForNewCompanies = (availableTypes: ApproverType[]): NominationType[] => {
    return availableTypes.includes(ApproverType.NEW_COMPANY) ? [NominationType.NEW_COMPANY] : []
  }

  const getNominationTypesForAdditionalAttendees = (availableTypes: ApproverType[]): NominationType[] => {
    return availableTypes.includes(ApproverType.NEW_NOMIMEE) ? [NominationType.ADDITIONAL_ATTENDEE] : []
  }

  const getNominationTypesForCompletedRequests = (availableTypes: ApproverType[]): NominationType[] => {
    return [
      ...getNominationTypesForSwap(availableTypes),
      ...getNominationTypesForAdditionalAttendees(availableTypes),
      ...getNominationTypesForNewCompanies(availableTypes),
    ]
  }

  const getUserRoleProps = async (approver: UserDTO): Promise<{ types: ApproverType[], segmentNames: string[] }> => {
    const models = await mongodbManager.roleModel
      .find({ userId: approver.id, type: RoleType.APPROVER, status: RoleStatus.ACCEPTED })
      .exec()
    const types: ApproverType[] = []
    const segmentNames: string[] = []
    for (const model of models) {
      if (typeof model.approverType !== 'undefined') {
        types.push(model.approverType)
      }
      if (typeof model.segmentName !== 'undefined') {
        segmentNames.push(model.segmentName)
      }
    }
    return { types, segmentNames }
  }

  return Object.freeze({
    getNominationsForApproval,
  })
}
