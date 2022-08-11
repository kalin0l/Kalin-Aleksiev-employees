import React from "react";
import './main.css'




const CsvForm = ({calculate,changeHandler}) => {
    return <form onSubmit={calculate}>
    <label htmlFor="csvInput">Enter CSV File</label>
    <input onChange={changeHandler} id="csvInput" name="file" type="File" />
    <button className="btn">Parse</button>
  </form>
}

export default CsvForm;