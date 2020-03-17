import { Router } from '../../../../frameworks/api/core/routers'
import {
  makeNominationExecutor,
  makeSendNominationRequestExecutor,
  makeSendNominationRequestValidator,
  makeGetNominationsExecutor,
  makeGetNominationsValidator,
  makeCancelNominationExecutor,
  makeCancelNominationValidator,
  makeRejectNominationExecutor,
  makeRejectNominationValidator,
  makeApproveNominationExecutor,
  makeApproveNominationValidator,
  makeGetNominationsForApprovalExecutor,
  makeGetNominationsForApprovalValidator,
  makeGetExpandedNominationByIdExecutor,
  makeGetExpandedNominationByIdValidator,
  makeUpdateNominationExecutor,
  makeUpdateNominationValidator,
  makeSubscribeToNominationExecutor,
  makeSubscribeToNominationValidator,
} from '../../../../frameworks/api/components'
import { EventBus } from '../../../../core/events'
import {
  NominationDTO,
  SendNominationRequestRepository,
  GetNominationsRepository,
  CancelNominationRepository,
  UserDTO,
  RejectNominationRepository,
  ApproveNominationRepository,
  GetNominationsForApprovalRepository,
  GetExpandedNominationByIdRepository,
  UpdateNominationRepository,
  SubscribeToNominationRepository,
} from '../../../../components'
import { RestRepository, ValidatorService, AuthenticationObject } from '../../../../core/definitions'
import { HttpRequest } from '../../core/http'
import { AuthorizationService, AuthenticationService } from '../../../../core/services'
import { TimeHelper } from '../../../../core/utils'

export const configureNominationRouter = (
  router: Router,
  eventBus: EventBus,
  validatorService: ValidatorService,
  nominationRestRepository: RestRepository<NominationDTO>,
  makeAuthorizationService: (req: HttpRequest) => AuthorizationService<UserDTO>,
  makeAuthenticationService: (req: HttpRequest) => AuthenticationService<AuthenticationObject>,
  sendNominationRequestRepository: SendNominationRequestRepository,
  getNominationsRepository: GetNominationsRepository,
  cancelNominationRepository: CancelNominationRepository,
  rejectNominationRepository: RejectNominationRepository,
  approveNominationRepository: ApproveNominationRepository,
  getNominationsForApprovalRepository: GetNominationsForApprovalRepository,
  getExpandedNominationByIdRepository: GetExpandedNominationByIdRepository,
  updateNominationRepository: UpdateNominationRepository,
  subscribeToNominationRepository: SubscribeToNominationRepository,
  timeHelper: TimeHelper,
) => {
  const nominationExecutor = makeNominationExecutor(
    eventBus,
    nominationRestRepository,
    makeAuthorizationService,
    validatorService,
    makeAuthenticationService,
  )

  const sendNominationRequestExecutor = makeSendNominationRequestExecutor(
    eventBus,
    sendNominationRequestRepository,
    makeSendNominationRequestValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  const getNominationsExecutor = makeGetNominationsExecutor(
    eventBus,
    getNominationsRepository,
    makeGetNominationsValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
  )

  const cancelNominationExecutor = makeCancelNominationExecutor(
    eventBus,
    cancelNominationRepository,
    makeCancelNominationValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
  )

  const rejectNominationExecutor = makeRejectNominationExecutor(
    eventBus,
    rejectNominationRepository,
    makeRejectNominationValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  const approveNominationExecutor = makeApproveNominationExecutor(
    eventBus,
    approveNominationRepository,
    makeApproveNominationValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  const getNominationsForApprovalExecutor = makeGetNominationsForApprovalExecutor(
    eventBus,
    getNominationsForApprovalRepository,
    makeGetNominationsForApprovalValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  const getExpandedNominationByIdExecutor = makeGetExpandedNominationByIdExecutor(
    eventBus,
    getExpandedNominationByIdRepository,
    makeGetExpandedNominationByIdValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  const updateNominationExecutor = makeUpdateNominationExecutor(
    eventBus,
    updateNominationRepository,
    makeUpdateNominationValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
  )

  const subscribeToNominationExecutor = makeSubscribeToNominationExecutor(
    eventBus,
    subscribeToNominationRepository,
    makeSubscribeToNominationValidator(validatorService),
    makeAuthenticationService,
    makeAuthorizationService,
    timeHelper,
  )

  return router
    .delete('/:id', nominationExecutor.makeDeleteCallback())
    .get('/:id', nominationExecutor.makeGetByIdCallback())
    .patch('/:id', nominationExecutor.makeUpdateCallback())
    .post('/approve', approveNominationExecutor)
    .post('/reject', rejectNominationExecutor)
    .post('/cancel', cancelNominationExecutor)
    .post('/get-expanded-nomination-by-id', getExpandedNominationByIdExecutor)
    .post('/get-nominations', getNominationsExecutor)
    .post('/get-nominations-for-approval', getNominationsForApprovalExecutor)
    .post('/list', nominationExecutor.makeGetListCallback())
    .post('/send-nomination-request', sendNominationRequestExecutor)
    .post('/subscribe-to-nomination', subscribeToNominationExecutor)
    .post('/update-nomination', updateNominationExecutor)
    .post('/', nominationExecutor.makeCreateCallback())
    .put('/:id', nominationExecutor.makeReplaceCallback())
}
