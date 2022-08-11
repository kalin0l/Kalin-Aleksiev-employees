import React, { useState } from "react";
import "./main.css";
import CsvForm from "./CsvForm";
import Papa from "papaparse";
import Days from './Days'
import DataContainer from "./DataContainer";
import ProjectId from "./ProjectId";

const Main = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);

  const calculate = (e,empl) => {
    e.preventDefault();
    console.log(empl);
    let pairs = {};
    let daysTogether = {};
    if (empl)
      empl.forEach((el1) => {
        // console.log(el1);
        /*
          .slice() is used to exclude the current employee and employees before him
          from the search which slightly reduces complexity. This is because
          employee 5 + employee 13 is the same as employee 13 + employee 5
        */
        empl.slice(empl.indexOf(el1) + 1, empl.length).forEach((el2) => {
          console.log(el1,el2);
          // get start and end date of each of employee
          if (el1.EmpID !== el2.EmpID) {
            const startDate1 = new Date(el1.DateFrom);
            const endDate1 = el1.DateTo === "NULL" ? new Date() : new Date(el1.DateTo);
            const startDate2 = new Date(el2.DateFrom);
            const endDate2 = el2.DateTo === "NULL" ? new Date() : new Date(el2.DateTo);
  
            // check if they are in the same team (working on the same project)
            if (el1.ProjectID === el2.ProjectID) {
              if (startDate1 <= endDate2 && startDate2 <= endDate1) {
                // calculate the start and end day that we need
                const start = startDate1 <= startDate2 ? startDate2 : startDate1;
                const end = endDate1 <= endDate2 ? endDate1 : endDate2;
                if (end >= startDate2) {
                  // put them inside this formula and we get the time they have worked together in days
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const x = `${el1.EmpID}${el2.EmpID}`;
  
                  if (!daysTogether[x]) Object.assign(daysTogether, { [x]: 0 });
                  daysTogether[x] = 1 * daysTogether[x] + diffDays;
  
                  if (!pairs[x]) Object.assign(pairs, { [x]: [] });
                  pairs[x] = [...pairs[x], [el1.EmpID, el2.EmpID, el1.ProjectID, diffDays]];
                }
              }
            }
          }
        });
      });

    /*
      gets the index of the pair that have worked together the longest toghether from
      "daysTogether" which keeps count of the days for each project
    */
    setUser(pairs[
      Object.keys(daysTogether).reduce((a, b) =>
        daysTogether[a] > daysTogether[b] ? a : b
      )
    ]);
  }
  console.log(user);
 

  const changeHandler = (event) => {
    console.log(event.target.files[0]);

    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
        const valuesArray = [];

        results.data.map((el) => {
          valuesArray.push(el);
        });
        
        setData(valuesArray);
      },
    });
  };
console.log(data);
  return (
    <>
    <CsvForm calculate={(e) => calculate(e,data)} changeHandler={changeHandler}/>
      <section className="data-container">
        <div className="emp-container">
          {user && user.length > 0 ? <DataContainer user1={user[0][0]} user2={user[0][1]}/> :null}
          <div>
            <h5>Days worked </h5>
            <div>
             {user && user.length > 0 ? <Days day={user[0][3]}/> :null}
            </div>
          </div>
          {user && user.length > 0 ?<ProjectId project={user[0][2]}/> : null}
        </div>
      </section>
    </>
  );
};

export default Main;
