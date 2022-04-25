import {GameController} from "../gameTS/game";

const CHOOSE_HERO = "CHOOSE_HERO";
const CHOOSE_ENEMY = "CHOOSE_ENEMY";

console.log(GameController)
let initialState = {
    hero : GameController.ChoosenHero,
    enemies : GameController.EnemiesField,
    choosenEnemy : GameController.ChoosenEnemy
}

const gameReducer = (state = initialState, action : any) => {
    let newState = {...state};
    switch(action.type){
        case CHOOSE_HERO:
            newState.hero = action.hero;
            return newState;
        case CHOOSE_ENEMY:
            newState.enemies = action.enemies;
            newState.choosenEnemy = action.choosenEnemy;
            console.log(newState)
            return newState;
        default:
            return newState;
    }
}

export function chooseHeroActionCreator(hero : any){
    return {type : CHOOSE_HERO, hero : hero}
}

export function chooseEnemyActionCreator(enemies : any, choosenEnemy : any){
    return {type : CHOOSE_ENEMY, enemies : enemies, choosenEnemy : choosenEnemy}
}

export function LoadThunk(){
    return(dispatch : any) => {
        dispatch(chooseEnemyActionCreator(GameController.EnemiesField, GameController.ChoosenEnemy));
        dispatch(chooseHeroActionCreator(GameController.ChoosenHero));
    };
}
export default gameReducer;