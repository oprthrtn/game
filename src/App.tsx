import {Button, Card, Col, Container, OverlayTrigger, Popover, ProgressBar, Row} from "react-bootstrap";
import ChooseYourFighter from "./Components/ChooseYourFighter";
import {useDispatch, useSelector} from 'react-redux';
import {LoadThunk} from "./reducers/gamePage-reducer";
import { Ability, GameController, Character, Unit} from "./gameTS/game";
import EnemyCard from "./Components/EnemyCard";

function App(props) {

  const dispatch = useDispatch();

  var hero : Character = useSelector((state: any) => state.gamePage.hero);
  var enemies : Unit[] = useSelector((state : any) => state.gamePage.enemies);
  var target : Unit =  useSelector((state : any) => state.gamePage.choosenEnemy);
  
  function ChooseAbility(ind : number){
    hero.MoveSet[ind].CastAbility(target, hero);
    dispatch(LoadThunk());
  }
  
  function NextStep(){
    if(GameController.ChoosenHero.IsDead === false){
      GameController.NextStep();
    }
    else{
      document.location.reload();
    }
    
    dispatch(LoadThunk());
  }

  function popover(ability : Ability) {
    return(
    <Popover id="popover-basic">
      <Popover.Header as="h3">Описание</Popover.Header>
          <Card>
            <Card.Body>
                <Card.Title className="pb-4">{ability.AbilityDescription}</Card.Title>
                <Card.Subtitle>Мана: {ability.RequiredMP}</Card.Subtitle>
            </Card.Body>
          </Card>
    </Popover>)
  }

  return (
    <div className="App h-100">
      <Container className="h-100">
        <Row className="d-flex h-100">
          <Col className="flex-column align-items-start">
            <Card className="p-0 m-3 w-50">
              <Card.Body>
                <Card.Title>{hero.Name}</Card.Title>
                <Card.Text>{hero.Motto}</Card.Text>
                <ProgressBar variant="danger" now={hero.Hp} max={hero.MaxHp} label={`${hero.Hp}`}></ProgressBar>
                <ProgressBar className="mt-1" now={hero.Mp} max={hero.MaxMp} label={`${hero.Mp}`}></ProgressBar>
              </Card.Body>
            </Card>

            {hero.MoveSet.map((ability : Ability, ind : number) => {
                  if(hero.Mp >= ability.RequiredMP && ability.CooldownStep === ability.Cooldown && hero.IsDead === false){
                    return (
                      <OverlayTrigger trigger="hover" placement="right" overlay={popover(ability)}>
                          <Button disabled={hero.IsDead} key={ind} variant="light" size="lg" className="p-0 m-3 w-50" onClick={() => {ChooseAbility(ind)}}>
                            <Card className="p-4">
                              <Card.Body>
                                <Card.Title>{ability.AbilityName}</Card.Title>
                                <ProgressBar className="mt-1" animated now={ability.CooldownStep} max={ability.Cooldown} label={`${ability.CooldownStep / ability.Cooldown * 100}`}></ProgressBar>
                              </Card.Body>
                            </Card>
                        </Button>
                      </OverlayTrigger>)
                  }
                  else{
                    return (
                      <OverlayTrigger trigger="hover" placement="right" overlay={popover(ability)}>
                          <Button disabled={true} key={ind} variant="light" size="lg" className="p-0 m-3 w-50 text-light" onClick={() => {ChooseAbility(ind)}}>
                            <Card className="p-4" bg="secondary">
                              <Card.Body>
                                <Card.Title>{ability.AbilityName}</Card.Title>
                                <ProgressBar className="mt-1" variant="danger" animated now={ability.CooldownStep} max={ability.Cooldown} label={`${Math.round(ability.CooldownStep / ability.Cooldown * 100)}`}></ProgressBar>
                              </Card.Body>
                            </Card>
                        </Button>
                      </OverlayTrigger>)
                  }
              })
            }
            {hero.IsDead ? (
              <Button variant="outline-danger" size="lg" className="p-4 m-3 mt-4 w-50" onClick={() => { NextStep(); } }>Вы мертвы</Button>
            ) : (
              <Button variant="outline-success" size="lg" className="p-4 m-3 mt-4 w-50" onClick={() => { NextStep(); } }>Закончить ход</Button>
            )}
          </Col>

          <Col className="d-flex flex-column align-items-end">
            {enemies.map((enemy : Unit, ind : number) => {
              let props = {
                enemy : enemy,
                ind : ind
              }
              return(<EnemyCard {...props}></EnemyCard>)
            })}
            </Col>
        </Row>
      </Container>
      <ChooseYourFighter/>
    </div>
  );
}

export default App;
