import * as Yup from 'yup';

export default function (props) {
    const phoneRegExp = /^((\+)?(\d{2}[-]))?(\d{10}){1}?$/;
    if (props.validation) {
        let validationSchema: any;
        if (!props.validation[0].status) {
            return Yup.object().shape(props.validation)
        } else {
            let validation = Yup.string();
            for (let i = 0; i < props.validation.length; i++) {
                if (props.validation[i].status === 'required') {
                    validation = validation.required(props.validation[i].msg)
                }
                if (props.validation[i].status === 'validEmail') {
                    validation = validation.email(props.validation[i].msg)
                }
                if (props.validation[i].status === 'validPhoneNumber') {
                    if (props.validation[i].exp) {
                        validation = validation.matches(props.validation[i].exp, props.validation[i].msg)
                    } else {
                        validation = validation.matches(phoneRegExp, props.validation[i].msg)
                    }
                }
            }
            return Yup.object().shape({ [props.id]: validation });
        }
    } else {

    }
}
