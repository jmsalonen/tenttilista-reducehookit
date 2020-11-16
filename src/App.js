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
  let newQuestion

  switch (action.type) {
    case 'increment': 
      return { count: ++state.count }
    case "SET_DATA": 
      return action.data
    case "UPDATE_SELECTED": // ruudulla tällä hetkellä näkyvä tentti
      newData.selected = action.data
      console.log(newData.selected)
      return newData
    case "UPDATE_USERTYPE": 
      newData.usertype = newData.usertype === "student" ? "teacher" : "student"
      console.log(newData.usertype)
      return newData
    case "UPDATE_EXAM": // exam on tentti
      newData.exam[action.data.index] = action.data.exam
      return newData
    case "HANDLE_BUTTON": // opiskelijan "valmis" nappi
      newData.exam[action.data.index] = action.data.exam
      newData.exam[action.data.index].finished = true
      return newData
    case "ADD_EXAM":
      newData.exam.push(EMPTY_EXAM) 
      newData.selected = newData.exam.length - 1
      return newData
    case "REMOVE_EXAM": 
      newData.exam = newData.exam.filter((item, index) => index !== action.data)
      if (newData.exam.length < 1)
        newData.exam.push(EMPTY_EXAM)
      return newData
    case "UPDATE_EXAM_NAME": // käytetään uuden tentin luonnin yhteydessä
      if (action.data.length > 0)
        newData.exam[newData.exam.length - 1].title = action.data
      return newData
    case "HANDLE_STUDENT_CLICK": // boxien klikit
      newQuestion = newData.exam[action.data.examId].question
      if (newQuestion[action.data.questionId].type === "radio") 
        newQuestion[action.data.questionId].answer = newQuestion[action.data.questionId].answer.map((item, index) => 
          (item = action.data.answerId === index ? true : false))
      else
        newQuestion[action.data.questionId].answer[action.data.answerId] = newQuestion[action.data.questionId].answer[action.data.answerId] === false ? true : false
      return newData
    case "HANDLE_TEACHER_CLICK": // boxien klikit
      newQuestion = newData.exam[action.data.examId].question
      newQuestion[action.data.questionId].correct[action.data.answerId] = newQuestion[action.data.questionId].correct[action.data.answerId] === false ? true : false
      if (newQuestion[action.data.questionId].correct.filter(item => item).length < 2) // boolean item
        newQuestion[action.data.questionId].type = "radio"
      else
        newQuestion[action.data.questionId].type = "checkbox"
      return newData
    case "UPDATE_TITLE": // "title" on se itse kysymys
      newQuestion = newData.exam[action.data.examId].question
      newQuestion[action.data.questionId].title = action.data.newTitle
      return newData
    case "UPDATE_OPTION": // "option" on vastausvaihtoehto stringit
      newQuestion = newData.exam[action.data.examId].question
      newQuestion[action.data.questionId].option[action.data.optionsId] = action.data.newValue
      return newData
    case "ADD_ANSWER": // "answer" on opiskelijan vastaus, "correct" on oikea vastaus
      newQuestion = newData.exam[action.data.examId].question
      newQuestion[action.data.questionId].option.push("")
      newQuestion[action.data.questionId].answer.push(false)
      newQuestion[action.data.questionId].correct.push(false)
      return newData
    case "REMOVE_ANSWER": // poistaa yhden checkboxin
      newQuestion = newData.exam[action.data.examId].question
      newQuestion[action.data.questionId].option = 
        newQuestion[action.data.questionId].option
        .filter((item, index) => index !== action.data.optionId)
      newQuestion[action.data.questionId].answer = 
        newQuestion[action.data.questionId].answer
        .filter((item, index) => index !== action.data.optionId)
      newQuestion[action.data.questionId].correct = 
        newQuestion[action.data.questionId].correct
        .filter((item, index) => index !== action.data.optionId)
      return newData
    case "ADD_QUESTION": // tentin kysymys
      newData.exam[action.data].question.push(EMPTY_QUESTION)
      return newData
    case "REMOVE_QUESTION": 
      newData.exam[action.data.examId].question = 
        newData.exam[action.data.examId].question
          .filter((item, index) => index !== action.data.questionId)
      console.log(action.data.examId)
      console.log(action.data.questionId)
      return newData
    default: 
      throw new Error()
  }
}

const App = () => {
  
  const [data, dispatch] = useReducer(reducer, [])
  const [examName, setExamName] = useState("")

  // 
  const getExamName = () => { 
    let name = examName
    setExamName("")
    return name
  }

  useEffect(() => { // GET DATA
    const getData = async () => {
      axios
        .get("http://localhost:3001/database")
        .then(response => {
            dispatch({type: "SET_DATA", data: response.data})
        })
    }
    getData()
  }, [])

  useEffect(() => { // PUT DATA
    const updateData = async () => {
      try {
        await axios.put("http://localhost:3001/database", data)
      }
      catch (exception) {
        console.log("database update failed")
      }
    }
    updateData()
  }, [data])

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
