import { useEffect, useState } from "react";
import { Button, Col, Row, Modal, Card } from "react-bootstrap";
import "../ModalStyles.css";
import {Character, GameController} from "../gameTS/game";
import { chooseHeroActionCreator } from "../reducers/gamePage-reducer";
import {useDispatch} from 'react-redux';

function ChooseYourFighter(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [desc, setDesc] = useState("");
    const [disp, setDisp] = useState("d-none");
    const dispatch = useDispatch();

    function chooseHero(hero : Character){
        setDisp("d-flex");

        setDesc(hero.Description);
        GameController.ChoosenHero = hero;
        
        dispatch(chooseHeroActionCreator(hero));
    }
    
    useEffect(() => {
        handleShow();
    }, []);

    
    return(
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose your fighter</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Row>
                {GameController.HeroesArray.map((hero : Character) => {
                    return (
                    <Col className="d-grid">
                        <Button variant="light" size="lg" className="p-0" onClick={() => chooseHero(hero)}>
                            <Card className="p-4">
                                <Card.Title>{hero.Name}</Card.Title>
                                <Card.Subtitle className="text-muted">{hero.Motto}</Card.Subtitle>
                                <Card.Body>Pick this dude</Card.Body>
                            </Card>
                        </Button>
                    </Col>)
                })}
            </Row>
        </Modal.Body>
        
        <Modal.Body className={disp}>{desc}</Modal.Body>
        <Modal.Footer className={disp}>
          <Button variant="primary" onClick={handleClose}>Confirm</Button>
        </Modal.Footer>
        
      </Modal>
    );
}

export default ChooseYourFighter;