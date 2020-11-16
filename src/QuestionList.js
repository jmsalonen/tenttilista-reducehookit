import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { green } from '@material-ui/core/colors'
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import { Button } from '@material-ui/core'

const QuestionList = ({id, examId, dispatch, clickType, usertype, finished, question}) => {
  if (usertype === "teacher")
    return (
      <Card className="kortti">
        <div>
          <div className="sulkuNappi">
            <Button color="secondary" onClick={() => dispatch({ type: "REMOVE_QUESTION", data: {examId: examId, quesitonId: id} })}>×</Button>
          </div>
          <TextField 
            label={`${id+1}. kysymys`} 
            value={question.title}
            style = {{width: '100%'}}
            onChange={(e) => dispatch({ type: "UPDATE_TITLE", data: { examId: examId, newTitle: e.target.value, questionId: id } })} 
          />
        </div>
        {question.option.map((item, index) => 
          <div>
            <Checkbox 
              style={{ color: green[500] }}
              id={index}
              name={question.title + id + "correct"} 
              type={question.type}
              checked={question.correct[index]}
              onClick={usertype === "student" ? function() {} 
                                              : () => dispatch({ type: clickType, data: { examId: examId, questionId: id, answerId: index} })}
              label="" 
            /> 
            <TextField 
              onChange={(e) => dispatch({ type: "UPDATE_OPTION", data: { examId: examId, newValue: e.target.value, questionId: id, optionsId: index } })} 
              label={item} 
              style = {{width: '50%'}} 
            />
            <Button color="secondary" onClick={() => dispatch({ type: "REMOVE_ANSWER", data: {examId: examId, questionId: id, optionId: index} })}>×</Button>
          </div>
        )}
        <Button color="primary" onClick={() => dispatch({ type: "ADD_ANSWER" , data: {examId: examId, questionId: id} })}>+</Button>
      </Card>
    )
  else // student
    return (
      <Card className="kortti">
        <div>
          {question.title}
          {finished ? (JSON.stringify(question.answer) === JSON.stringify(question.correct) 
                      ? <Button><CheckIcon style={{ color: green[500] }} /></Button> 
                      : <Button><BlockIcon color="secondary"/></Button>) 
                    : "" }
        </div>
        {question.option.map((item, index) => 
          <div>
            <Checkbox
              disabled={finished}
              id={index}
              name={question.title + id} 
              type={question.type}
              checked={question.answer[index]}
              onClick={() => dispatch({ type: clickType, data: { examId: examId, questionId: id, answerId: index} })}
              label="Primary"
            /> 
            {finished ? 
              <Checkbox 
                style={{ color: green[500] }}
                id={index}
                name={question.title + id + "correct"} 
                type={question.type}
                checked={question.correct[index]}
                onClick={usertype === "student" ? function() {} 
                                                : () => dispatch({ type: clickType, data: { examId: examId, questionId: id, answerId: index} })}
                label="" 
              /> 
            : "" }
            <label>{item}</label>
          </div>
        )}
      </Card>
    )
}

export default QuestionList
