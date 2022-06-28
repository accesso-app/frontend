import { ApplicationsListDone } from 'shared/api';

export type Application = ApplicationsListDone['answer']['installed'][number];
