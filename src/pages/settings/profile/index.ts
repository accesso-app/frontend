import { contract } from 'lib/contract';
import * as page from './page';
import * as model from './model';

export { SettingsProfilePage } from './page';

contract({
  page,
  model: {
    ...model,
    firstNameChanged: model.changeFirstName,
    lastNameChanged: model.changeLastName,
    formSubmitted: model.submitForm,
  },
});
