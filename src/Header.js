import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core'

const Header = ({dispatch}) => (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Button
          style={{ color: "white" }}
          onClick={() => dispatch({type: "UPDATE_USERTYPE"})}
        > 
          Tentti
        </Button> 
      </Toolbar>
    </AppBar>
  </div> 
)

export default Header
