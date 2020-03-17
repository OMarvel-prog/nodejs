import { HttpRequest } from '../../../../../frameworks/api/core/http'
import { ValidatorService } from '../../../../../core/definitions'
import { GetNominationsValidator } from '../../../../../components/nomination/use-cases/get-nominations/get-nominations.validator.def'
import { CountryCode } from '../../../../../components/nomination/entity/country-code.enum'
import { NominationMode } from '../../../../../components/nomination/entity/nomination-mode.enum'
import { Sector } from '../../../../../components/nomination/entity/sector.enum'

export const makeGetNominationsValidator = (
  validatorService: ValidatorService,
) => (req: HttpRequest): GetNominationsValidator => {
  const makeInput = () => {
    const body = req.body()
    return {
      companyIds: validatorService.optional.nonEmptyStringArray('companyIds', body.companyIds),
      countryCode: validatorService.optional.enumValue('countryCode', body.countryCode, CountryCode),
      eventId: validatorService.required.nonEmptyString('eventId', body.eventId),
      filter: body.filter, // TODO: implement validation
      limit: validatorService.optional.integer('limit', body.limit),
      nominationMode: validatorService.optional.enumValue('nominationMode', body.nominationMode, NominationMode),
      sector: validatorService.optional.enumValue('sector', body.sector, Sector),
      skip: validatorService.optional.integer('skip', body.skip),
      teamId: validatorService.optional.nonEmptyString('teamId', body.teamId),
    }
  }

  // @ts-ignore
  return Object.freeze({
    makeInput,
  })
}
