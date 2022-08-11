import React from "react"



const DataContainer = ({user1,user2}) => {
    return <>
  
          <div>
            <h5>Employee ID#1</h5>
            <div>{user1}</div>
          </div>
          <div>
            <h5>Employee ID#2</h5>
            <div>{user2}</div>
          </div>
        
      
    
    </>
}

export default DataContainer;