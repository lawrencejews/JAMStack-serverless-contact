import React, {useReducer} from "react";
import * as styles from './form.module.css';

const INITIAL_STATE = {
    name: '',
    email: '',
    subject: '',
    body: '',
    status: 'IDLE'
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'updateFieldValue':
            return { ...state, [action.field]: action.value };
        
        case 'updateStatus':
            return { ...state, status: action.status };
        
        case 'reset':
        
        default:
            return INITIAL_STATE;
    }
}

const Form = () => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    const setStatus = status => dispatch({ type: 'updateStatus', status });

    //Currying
    const updateFieldValue = field => event => {
        dispatch({
            type: 'updateFieldValue',
            field,
            value: event.target.value
        });
    }

    const handlerSubmit = event => {
        event.preventDefault();
        setStatus('PENDING');

        fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(state)
        })
            .then(response => response.json())
            .then (response => {
                console.log(response);
                setStatus("SUCCESS");
            })
            .catch(error => {
                console.error(error);
                setStatus('ERROR');
        })
    }

    if (state.status === 'SUCCESS') {
        return <p className={styles.success}>Message Sent! <button type="reset"
            onClick={() => dispatch({ type: 'reset' })} className={`${styles.button} ${styles.centered}`} >Reset</button></p>
    }

    return (
        <>
            {state.status === 'ERROR' && (<p className={styles.error}> Something Went Wrong. Please try again</p>)}
            
            <form className={`${styles.form} ${state.status === 'PENDING' && styles.pending}`} onSubmit={handlerSubmit}>
            <label className={styles.label}>
                Name
                <input className={styles.input} type="text" name="name" value={state.value} onChange={ updateFieldValue('name')}/>
            </label>
            <label className={styles.label}>
                Email
                <input className={styles.input} type="email" name="email" value={state.email} onChange={updateFieldValue('email')} />
            </label>
            <label className={styles.label}>
                Subject
                <input className={styles.input} type="text" name="subject" value={state.subject} onChange={ updateFieldValue('subject')}/>
            </label>
            <label className={styles.label}>
                Body
                <textarea className={styles.input} name="name" value={state.value} onChange={updateFieldValue('body')} />
            </label>
            <button className={styles.button}>Send</button>
            </form>
            </>
    )
}
export default Form;