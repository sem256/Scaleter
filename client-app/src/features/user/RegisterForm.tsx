import { FORM_ERROR } from 'final-form'
import { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate'
import { Button, Form, Header } from 'semantic-ui-react'
import { ErrorMessage } from '../../app/common/form/ErrorMessage'
import { TextInput } from '../../app/common/form/TextInput'
import { IUserFormValues } from '../../app/models/IUres'
import { RootStoreContext } from '../../app/stores/rootStore'

const validate = combineValidators({
    displayName: isRequired('display name'),
    username: isRequired('username'),
    email: isRequired('email'),
    password: isRequired('password')
})

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => register(values).catch((e) => ({
                [FORM_ERROR]: e
            }))}
            validate={validate}
            render = {({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Sign up to Scaletter' color='teal' textAlign='center'/>
                    <Field
                        name='username'
                        placeholder='Username'
                        component={TextInput}
                    />
                    <Field
                        name='displayName'
                        placeholder='DisplayName'
                        component={TextInput}
                    />
                    <Field
                        name='email'
                        placeholder='Email'
                        component={TextInput}
                    />
                    <Field
                        name='password'
                        placeholder='Password'
                        component={TextInput}
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit &&
                        (<ErrorMessage error={submitError} />)}
                    <br/>
                    <Button disabled={invalid && !dirtySinceLastSubmit || pristine} 
                        loading={submitting} 
                        color='teal' 
                        content='Login'
                        fluid />
                </Form>
            )}
        />
    )
}

export default RegisterForm;
