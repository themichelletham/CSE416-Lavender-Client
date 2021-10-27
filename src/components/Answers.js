const useStyles = makeStyles((theme) => ({
  answerWrapper: {
    paddingTop: 10, 
    paddingLeft: 50,
    paddingRight: 31,
    fontSize: 22,
    //fullWidth: 30,
    borderRadius: '70px',
  },
  answerText: {
    textAlign: 'left',  
    marginTop: 10,
    marginLeft: 30,
    width: '45vw'

  },
//   toolbar: theme.mixins.toolbar,
}));

function Answers(props, ref) {
  const classes = useStyles();

  const [answers, setAnswers] = useState([]);
  const [answer, setAnswerText] = useState({
    answer_text: '',
  })

  useImperativeHandle( ref, () => ({
    getanswers() {
      return answers;
    }
  }));
  
    //cretes new textbox
  const addAnswer = (e) => {
    let currentanswers = [...answers]
    let newanswer = "New answer";
    currentanswers.push(newanswer);
    setAnswers(currentanswers);
  }

  const removeAnswer = index => e => {
    let currentanswers = [...answers]
    currentanswers.splice(index,1)
    setAnswers(currentanswers);
  }

    //updates list of answers
    const onAnswerTextChange = index => e => {
      let tempAnswers = [...answers];
      setAnswerText({...answer.answer_text, answer_text:e.target.value});
      tempAnswers[index] = e.target.value;
      setAnswers(tempAnswers);
    }

    const deleteStyle = {
      backgroundColor: '#8A8AEE',
      marginLeft: 10,
      marginBottom: 10,
      color: 'black',
      float: "right",
      borderRadius: 20
    }

    const addStyle = {
      backgroundColor: '#8A8AEE',
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      marginRight: 10,
      color: 'black',
      float: "right",
      borderRadius: 20
    }

      
    return(
      <Box className={classes.preset} disableElevation>
        <div className={classes.toolbar} />
        {answers.map((answer, index) =>{
          return (
          <Box className={classes.answerWrapper} key={index} disableElevation> 
            <TextField className={classes.answerText}
                key={index}
                value={answers[index]}
                onChange={onAnswerTextChange(index)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" variant='contained'>
                      <IconButton onClick={removeAnswer(index)}>
                         <DeleteIcon disableElevation/>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                inputProps={{
                style: {
                    padding: 8,
                    fontSize: 20, 
                }, 
            }}
          />
          </Box>
          );
        })}
        <Button style={addStyle} variant='contained' onClick={addAnswer} disableElevation >+ Add answer</Button>
      </Box>
    );
}

export default forwardRef(Answers);