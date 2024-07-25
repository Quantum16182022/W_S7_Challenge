import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'

export default function Form() {
  const initialValues = {
    fullName: '',
    size: '',
    toppings: [],
  };
  const initialErrors = {
    fullName: '',
    size: '',
    toppings: [],  
  } 
  

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [serverSuccess, setserverSuccess] = useState('');
  const [serverFailure, setserverFailure] = useState('');
  const {formEnabled, setFormEnabled} = useState(false);  


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
        .of(Yup.string())
        .min(1,'At least one topping must be selected'),
});  

  useEffect(()=> {
  schema.isValid(values).then(setFormEnabled) 
  }, [values])

  const onChange = evt => {
    let {name, type, value, checked} = evt.target
    const newValue = type === 'checkbox' ? checked: value;
    if (type === 'checkbox') {
      // Update toppings based on checkbox selection
      setValues(prevValues => {
          const toppings = checked 
              ? [...prevValues.toppings, name] 
              : prevValues.toppings.filter(topping => topping !== name);
          return { ...prevValues, toppings };
      });
  } else {
    setValues({...values, [name]: newValue});
  }  
    Yup.reach(schema, name)
    .validate(name, {...values, [name]: newValue})
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

const onSubmit = async evt => {
  evt.preventDefault()
  try {
    await schema.validate(values);
    const response = await axios.post('http://localhost:9009/api/order', values);  
    console.log(response.data);  
    const numberOfToppings = values.toppings.length;
    const size = values.size;
    const fullName = values.fullName;  
    setserverSuccess(`Thank you for your order, ${fullName}! Your ${size} 
      pizza with ${numberOfToppings} topping${numberOfToppings !== 1 ? 's' : ''} 
      is on the way.`);
    setserverFailure('');
    setValues(initialValues);
  }
  catch (err) {
    console.error(err); // Log the full error object
    if (err.response) {
      // If the error is from the response, you can access response data here
      setserverFailure(err.response.data.message || 'An unexpected error occurred.');
    } else if (err.errors && err.errors.length > 0) {
      setserverFailure(err.errors[0]);
    } else {
      setserverFailure('An unexpected error occurred.');
    }
    setserverSuccess('');
  }
  //   catch (err) {
  //     if (err.errors && err.errors.length > 0) {
  //     setserverFailure(err.errors[0]);
      
  //   } else {
  //     setserverFailure('An unexpected error occurred.');
  //   }
  //   setserverSuccess('');
  // }
}


  return (

    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name"          
          id="fullName" 
          type="text" 
          name="fullName"
          value={values.fullName}
          onChange={onChange}
          />
        </div>
        {true && <div className='error'></div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select 
          id="size"
          name="size"
          value={values.size}
          onChange={onChange}
          >          
            <option value="">----Choose Size----</option>topping_
            {/* Fill out the missing options */}
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>

          </select>
        </div>
        {true && <div className='error'></div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}   
        {toppings.map(topping => ( 
        <label key= {topping.topping_id}>
          <input
           name={topping.topping_id}
           type="checkbox"
          onChange={onChange}
          value={topping.topping_id}

          />
          {topping.text}<br />
        </label>
        ))}       

      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled = {formEnabled} />
    </form>
        )
      }
      
