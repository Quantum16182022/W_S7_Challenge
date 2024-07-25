import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'


// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = Yup.object().shape({
  fullName:Yup.string()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong)
  .required('FullName is a required field'),
 size: Yup.string()
  .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
  .required('Size is a required field'),
  toppings: Yup.array()
        .of(Yup.string()), 
});
const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: [],
});
const getInitialErrors = () =>({
  fullName: '',
  size: '',
  toppings: [],  
});
  const [values, setValues] = useState(getInitialValues());
  const [errors, setErrors] = useState(getInitialErrors());
  const [serverSuccess, setserverSuccess] = useState('');
  const [serverFailure, setserverFailure] = useState('');
  const {formEnabled, setFormEnabled} = useState(false);  

  useEffect(()=> {
  schema.isValid(values).then(setFormEnabled) 
  }, [values])

  const onChange = evt => {
    let {name, type, value, checked} = evt.target
    const newValue = type === 'checkbox' ? checked: value;
    setValues({...values, [name]: newValue});

    schema
     .validateAt(name, {...values, [name]: newValue})
    .then(() => setErrors({...errors, [name]: ''}))
    .catch((err) => setErrors({...errors, [name]: err.errors[0] }))
  }
// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },

]

const onSubmit = evt => {
  evt.preventDefault()
  axios.post('http://localhost:9009/api/order', values)
  .then(res => {
    setserverSuccess(res.data.message)
    setserverFailure()
    setValues(getInitialValues())
  })
     .catch( err => {
      setserverFailure(err.response.data.message) 
      setserverSuccess()
    })
 }

export default function Form() {
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>Thank you for your order!</div>}
      {serverFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" />
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>topping_
            {/* Fill out the missing options */}
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>

          </select>
        </div>
        {true && <div className='error'>Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}   
        {toppings.map(topping => ( 
        <label key= {topping.topping_id}>
          <input
           name={topping.text}
           type="checkbox"
          onChange={onChange}

          />
          {topping.text}<br />
        </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled = {!formEnabled} />
    </form>
        )
      }
      