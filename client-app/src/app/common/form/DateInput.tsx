import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'
import { DateInput as SemanticDateInput, TimeInput } from 'semantic-ui-calendar-react';

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps { }

export const DateInput: React.FC<IProps> = ({
    input,
    isDate,
    placeholder,
    meta: { touched, error }
}) => {
if(isDate){
    return (
        <Form.Field error={touched && !!error}>
            <SemanticDateInput 
                value = {input.value.toString()}
                onChange={(e, data)=> input.onChange(data.value)}
                placeholder={placeholder}
            />
            {touched && error && (<Label basic color="red">
                {error}
            </Label>)}
        </Form.Field>
    )

}else{
    return (
        <Form.Field error={touched && !!error}>
            <TimeInput 
                value = {input.value.toString()}
                onChange={(e, data)=> input.onChange(data.value)}
                placeholder={placeholder}
            />
            {touched && error && (<Label basic color="red">
                {error}
            </Label>)}
        </Form.Field>
    )
}
}