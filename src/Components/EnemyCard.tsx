import { Button, Card, OverlayTrigger, ProgressBar, Popover } from "react-bootstrap";
import { GameController, Unit, Ability} from "../gameTS/game";
import {useDispatch, useSelector} from 'react-redux';
import {LoadThunk} from "../reducers/gamePage-reducer";
import "../ModalStyles.css";

function EnemyCard(props : {enemy : Unit, ind : number}) {
  const dispatch = useDispatch();
  var target : Unit =  useSelector((state : any) => state.gamePage.choosenEnemy);
  console.log(props)

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Способности</Popover.Header>
      {props.enemy.MoveSet.map((enemyPerk : Ability) =>{
        return (
          
            <Card>
              <Card.Body>
                <Card.Title>{enemyPerk.AbilityName}</Card.Title>
                <Card.Text>{enemyPerk.AbilityDescription}</Card.Text>
                {(enemyPerk.CooldownStep === enemyPerk.Cooldown) ? (
                  <ProgressBar className="mt-1" animated now={enemyPerk.CooldownStep} max={enemyPerk.Cooldown} label={`${enemyPerk.CooldownStep / enemyPerk.Cooldown * 100}`}></ProgressBar>
                ) : (
                  <ProgressBar className="mt-1" variant="warning" animated now={enemyPerk.CooldownStep} max={enemyPerk.Cooldown} label={`${enemyPerk.CooldownStep / enemyPerk.Cooldown * 100}`}></ProgressBar>
                )}
              </Card.Body>
            </Card>)
      })}
    </Popover>
  );
  
  function ChooseEnemy(ind : number){
    GameController.ChooseEnemy(ind);
    dispatch(LoadThunk());
  }

  let enemy : Unit = props.enemy;

  if(enemy !== target && enemy.IsDead === false){
    return (
      <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
        <Button variant="light" size="lg" className="p-0 m-3 w-50" onClick={() => {ChooseEnemy(props.ind)}}>
          <Card className="p-4">
            <Card.Body>
              <Card.Title>{enemy.Name}</Card.Title>
              <Card.Text></Card.Text>
              <ProgressBar variant="danger" now={enemy.Hp} max={enemy.MaxHp} label={`${enemy.Hp}`}></ProgressBar>
              <ProgressBar className="mt-1" now={enemy.Mp} max={enemy.MaxMp} label={`${enemy.Mp}`}></ProgressBar>
            </Card.Body>
          </Card>
        </Button>
      </OverlayTrigger>)
  }
  else if(enemy.IsDead === false){
    return(
      <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
        <Button variant="danger" size="lg" className="p-0 m-3 w-50 text-dark" onClick={() => {ChooseEnemy(props.ind)}}>
          <Card className="p-4">
            <Card.Body >
              <Card.Title>{enemy.Name}</Card.Title>
              <Card.Text></Card.Text>
              <ProgressBar variant="danger" now={enemy.Hp} max={enemy.MaxHp} label={`${enemy.Hp}`}></ProgressBar>
              <ProgressBar className="mt-1" now={enemy.Mp} max={enemy.MaxMp} label={`${enemy.Mp}`}></ProgressBar>
            </Card.Body>
          </Card>
        </Button>
      </OverlayTrigger>
    )
  }
  else{
    return(
      <OverlayTrigger trigger="hover" placement="left" overlay={popover}>
        <Button disabled={true} variant="secondary" size="lg" className="p-0 m-3 w-50 text-dark" onClick={() => {ChooseEnemy(props.ind)}}>
          <Card className="p-4">
            <Card.Body>
              <Card.Title>{enemy.Name}</Card.Title>
              <Card.Text></Card.Text>
              <ProgressBar variant="danger" now={enemy.Hp} max={enemy.MaxHp} label={`${enemy.Hp}`}></ProgressBar>
              <ProgressBar className="mt-1" now={enemy.Mp} max={enemy.MaxMp} label={`${enemy.Mp}`}></ProgressBar>
            </Card.Body>
          </Card>
        </Button>
      </OverlayTrigger>
    )
  }
}

export default EnemyCard;
