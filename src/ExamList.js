import { Button } from '@material-ui/core'
import { useEffect, useState } from 'react'
import QuestionList from './QuestionList.js'

const ExamList = ({thisExam, id, dispatch, usertype}) => (
  <div>
    {thisExam.question.map((item, index) => 
      <QuestionList 
        id={index} 
        examId={id}
        dispatch={dispatch}
        clickType={usertype === "student" ? "HANDLE_STUDENT_CLICK" : "HANDLE_TEACHER_CLICK"}
        usertype={usertype}
        finished={thisExam.finished} 
        question={item} 
      />
    )}
    {usertype === "teacher" 
      ? <div>
          <Button color="primary" onClick={() => dispatch({ type: "ADD_QUESTION", data: id })}>Uusi Kysymys</Button> 
          <div className="sulkuNappi"><Button color="secondary" onClick={() => dispatch({ type: "REMOVE_EXAM", data: id })}>Poista Tentti</Button> </div>
        </div>
      : "" }
  </div>
)

export default ExamList
