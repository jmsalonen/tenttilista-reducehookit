import './App.css'
import { useEffect, useReducer, useState } from 'react'
import { Button, Tab, TextField } from '@material-ui/core'
import axios from 'axios'

import Header from './Header.js'
import ExamList from './ExamList.js'

const EMPTY_EXAM = {title: "", finished: false, question: []}
const EMPTY_QUESTION = {title: "", type: "", option: [], answer: [], correct: []}

function reducer(state, action) {
  let newData = JSON.parse(JSON.stringify(state))

  switch (action.type) {
    case 'increment': 
      return { count: ++state.count }
    case "SET_DATA": 
      return action.data
    case "UPDATE_SELECTED": 
      newData.selected = action.data
      console.log(newData.selected)
      return newData
    case "UPDATE_USERTYPE": 
      newData.usertype = newData.usertype === "student" ? "teacher" : "student"
      console.log(newData.usertype)
      return newData
    case "UPDATE_EXAM": 
      newData.exam[action.data.index] = action.data.exam
      return newData
    case "HANDLE_BUTTON": 
      newData.exam[action.data.index].finished = true
      newData.exam[action.data.index] = action.data.exam
      return newData
    case "ADD_EXAM":
      newData.exam.push({title: "", finished: false, question: []}) // toimiiko const? 
      newData.selected = newData.exam.length - 1
      return newData
    case "REMOVE_EXAM": 
      newData.exam = newData.exam.filter((item, index) => index !== action.data)
      if (newData.exam.length < 1)
        newData.exam.push({title: "", finished: false, question: []})
      return newData
    case "UPDATE_EXAM_NAME": 
      newData.exam[newData.exam.length - 1].title = action.data
      return newData
    case "HANDLE_STUDENT_CLICK":
      if (newData.exam[action.data.examId].question[action.data.questionId].type === "radio") 
        newData.exam[action.data.examId].question[action.data.questionId].answer = newData.exam[action.data.examId].question[action.data.questionId].answer.map((item, index) => 
          (item = action.data.answerId === index ? true : false))
      else
        newData.exam[action.data.examId].question[action.data.questionId].answer[action.data.answerId] = newData.exam[action.data.examId].question[action.data.questionId].answer[action.data.answerId] === false ? true : false
      return newData
    case "HANDLE_TEACHER_CLICK":
      newData.exam[action.data.examId].question[action.data.questionId].correct[action.data.answerId] = newData.exam[action.data.examId].question[action.data.questionId].correct[action.data.answerId] === false ? true : false
      if (newData.exam[action.data.examId].question[action.data.questionId].correct.filter(item => item).length < 2) // boolean item
        newData.exam[action.data.examId].question[action.data.questionId].type = "radio"
      else
        newData.exam[action.data.examId].question[action.data.questionId].type = "checkbox"
      return newData
    case "UPDATE_TITLE":
      newData.exam[action.data.examId].question[action.data.questionId].title = action.data.newTitle
      return newData
    case "UPDATE_OPTION": 
      newData.exam[action.data.examId].question[action.data.questionId].option[action.data.optionsId] = action.data.newValue
      return newData
    case "ADD_ANSWER":
      newData.exam[action.data.examId].question[action.data.questionId].option.push("")
      newData.exam[action.data.examId].question[action.data.questionId].answer.push(false)
      newData.exam[action.data.examId].question[action.data.questionId].correct.push(false)
      return newData
    case "REMOVE_ANSWER":
      newData.exam[action.data.examId].question[action.data.questionId].option = 
        newData.exam[action.data.examId].question[action.data.questionId].option
        .filter((item, index) => index !== action.data.optionId)
      newData.exam[action.data.examId].question[action.data.questionId].answer = 
        newData.exam[action.data.examId].question[action.data.questionId].answer
        .filter((item, index) => index !== action.data.optionId)
      newData.exam[action.data.examId].question[action.data.questionId].correct = 
        newData.exam[action.data.examId].question[action.data.questionId].correct
        .filter((item, index) => index !== action.data.optionId)
      return newData
    case "ADD_QUESTION": 
      newData.exam[action.data].question.push({title: "", type: "", option: [], answer: [], correct: []})
      return newData
    case "REMOVE_QUESTION": 
      newData.exam[action.data.examId].question = newData.exam[action.data.examId].question.filter((item, index) => index !== action.data.questionId)
      console.log(1)
      return newData
    default: 
      throw new Error()
  }
}

const App = () => {
  
  const [data, dispatch] = useReducer(reducer, [])
  const [examName, setExamName] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:3001/database")
      .then(response => {
        //if (data.length > 0) 
          dispatch({type: "SET_DATA", data: response.data})
        // setData(response.data)
      })
  }, [])

  useEffect(() => {
    const updateData = async () => {
      try {
        if (data.length > 0)
        await axios.put("http://localhost:3001/database", data)
      }
      catch (exception) {
        console.log("database update failed")
      }
    }

    //if (data !== undefined)
      updateData()
  }, [data])

  // const updateSelected = (selected) => {
  //   let newData = JSON.parse(JSON.stringify(data))
  //   newData.selected = selected
  //   setData(newData)
  // }

  // const updateUsertype = () => {
  //   let newData = JSON.parse(JSON.stringify(data)); 
  //   newData.usertype = newData.usertype === "student" ? "teacher" : "student"
  //   console.log(newData.usertype)
  //   setData(newData)
  // }
  
  // const updateExam = (exam, index) => {
  //   let newData = JSON.parse(JSON.stringify(data))
  //   newData.exam[index] = exam
  //   setData(newData)
  // }

  // const handleButton = (exam, index) => {
  //   exam.finished = true
  //   updateExam(exam, index)
  // }

  // const addNewExam = () => {
  //   let newData = JSON.parse(JSON.stringify(data))
  //   newData.exam.push({title: "", finished: false, question: []})
  //   newData.selected = newData.exam.length - 1
  //   setData(newData)
  // }

  // const removeExam = (examId) => {
  //   let newData = JSON.parse(JSON.stringify(data))
  //   newData.exam = newData.exam.filter((item, index) => index !== examId)
  //   if (newData.exam.length < 1)
  //     newData.exam.push({title: "", finished: false, question: []})
  //   setData(newData)
  // }

  // const updateExamName = () => {
  //   let newData = JSON.parse(JSON.stringify(data))
  //   let lastItem = newData.exam.length - 1;
  //   newData.exam[lastItem].title = examName
  //   setData(newData)
  //   setExamName("")
  // }

  const getExamName = () => {
    let name = examName
    setExamName("")
    return name
  }
  
  if (data.length < 1) 
    return (<>- loading... <div><br />npx json-server --port=3001 --watch db.json <br />or<br /> npm run server</div></>)
  
  if (data.usertype === "teacher")
    return (
      <div>
        <Header dispatch={dispatch}/>
        <div className="Tenttilista">
          {data.exam.map((item, index) => 
            <Button 
              color="primary" 
              onClick={() => dispatch({ type: "UPDATE_SELECTED", data: index })}
            >
              {item.title}
            </Button>
          )}
          {data.exam[data.exam.length-1].title.length > 1 ? <Button color="primary" onClick={() => dispatch({ type: "ADD_EXAM" })}>+</Button> : "" }
          {data.exam.map((item, index) => item.title.length < 1 
          ? <div>
              <br />
              <Tab /><TextField label={"Anna Tentille Nimi"} onChange={(e) => setExamName(e.target.value)}/>
              <br /><br />
              <Tab /><Button variant="contained" color="primary" onClick={() => dispatch({ type: "UPDATE_EXAM_NAME", data: getExamName() })}>OK</Button>
            </div>
          : (index === data.selected 
              ? <ExamList
                  id={index}
                  dispatch={dispatch}
                  usertype={data.usertype}
                  thisExam={item}
                  //updateExam={updateExam}
                  // removeExam={removeExam}
                />
              : "")
            )}
        </div>
      </div>
    )
  else // student
    return (
      <div>
        <Header dispatch={dispatch}/>
        <div className="Tenttilista">
          {data.exam.map((item, index) => 
            <Button 
              color="primary" 
              onClick={() => (dispatch({ type: "UPDATE_SELECTED", data: index }))}
            >
              {item.title}
            </Button>
          )}
          {data.exam.map((item, index) => 
            (index === data.selected 
              ? <div>
                <ExamList
                  id={index}
                  dispatch={dispatch}
                  usertype={data.usertype}
                  thisExam={item}
                  // updateExam={updateExam}
                  // removeExam={removeExam}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => dispatch({ type: "HANDLE_BUTTON", data: { exam: item, index: index} })}
                >
                  Valmis
                </Button>
                </div>
              : "")
            )}
        </div>
      </div>
    )
}

export default App
