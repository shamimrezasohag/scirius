import { createSelector } from 'reselect';
import moment from 'moment';
import { TimePickerEnum } from 'ui/maps/TimePickersEnum';
import { PeriodEnum } from 'ui/maps/PeriodEnum';
import { parseObjectToUrl } from 'ui/helpers/parseObjectToUrl';
import { initialState } from 'ui/containers/App/reducer';

const selectGlobal = state => state.global.ce || initialState;

const selectRouter = state => state.router || { location: {} };

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectGlobalSettings = () =>
  createSelector(
    selectGlobal,
    subState => subState.settings.data.global,
  );

const makeSelectSystemSettings = () =>
  createSelector(
    selectGlobal,
    subState => subState.settings.data.system,
  );

const makeSelectUser = () =>
  createSelector(
    selectGlobal,
    ({ user }) => user,
  );

const makeSelectStartDate = () =>
  createSelector(
    selectGlobal,
    subState => {
      if (subState.timespan.timePicker === TimePickerEnum.ABSOLUTE) {
        return moment(subState.timespan.startDate);
      }
      const { minTimestamp } = subState.timespan;
      if (subState.timespan.duration === 'All') {
        // D7 period is the default one if min/max timestamp boundaries are incorrect
        return !Number.isNaN(parseInt(minTimestamp, 10)) ? moment(minTimestamp) : moment().subtract(7, 'days');
      }
      return moment(subState.timespan.now).subtract(PeriodEnum[subState.timespan.duration].seconds, 'milliseconds');
    },
  );

const makeSelectEndDate = () =>
  createSelector(
    selectGlobal,
    subState => {
      if (subState.timespan.timePicker === TimePickerEnum.ABSOLUTE) {
        return moment(subState.timespan.endDate);
      }
      const { maxTimestamp } = subState.timespan;
      if (subState.timespan.duration === 'All') {
        // D7 period is the default one if min/max timestamp boundaries are incorrect
        return !Number.isNaN(parseInt(maxTimestamp, 10)) ? moment(maxTimestamp) : moment();
      }
      return moment(subState.timespan.now);
    },
  );

const makeSelectTimePicker = () =>
  createSelector(
    selectGlobal,
    familiesState => familiesState.timespan.timePicker,
  );

const makeSelectTimespan = () =>
  createSelector(
    selectGlobal,
    familiesState => familiesState.timespan,
  );

const makeSelectDuration = () =>
  createSelector(
    selectGlobal,
    familiesState => familiesState.timespan.duration,
  );

const makeSelectReload = () =>
  createSelector(
    selectGlobal,
    subState => subState.reload,
  );

const makeSelectReloadFlag = () =>
  createSelector(
    selectGlobal,
    subState => subState.reload.now,
  );

const makeSelectFilters = () =>
  createSelector(
    selectGlobal,
    subState => subState.filters,
  );

const makeSelectFiltersParam = (prefix = '&', skipStatus = false) =>
  createSelector(
    selectGlobal,
    makeSelectGlobalSettings(),
    (subState, globalSettingsState) => {
      const filters = Object.assign({}, subState.filters);
      if (skipStatus === true) {
        delete filters.status;
      }
      const { multi_tenancy: multiTenancy = false } = globalSettingsState;
      if (multiTenancy && !filters.tenant) {
        filters.tenant = 0;
      }
      if (!multiTenancy && filters.tenant) {
        delete filters.tenant;
      }
      const urlParams = parseObjectToUrl(filters);
      return urlParams.length > 0 ? `${prefix}${urlParams}` : '';
    },
  );

const makeSelectSource = () =>
  createSelector(
    selectGlobal,
    subState => subState.source,
  );

export default {
  selectGlobal,
  makeSelectLocation,
  makeSelectSystemSettings,
  makeSelectGlobalSettings,
  makeSelectStartDate,
  makeSelectEndDate,
  makeSelectTimespan,
  makeSelectDuration,
  makeSelectTimePicker,
  makeSelectUser,
  makeSelectReload,
  makeSelectReloadFlag,
  makeSelectFilters,
  makeSelectFiltersParam,
  makeSelectSource,
};
