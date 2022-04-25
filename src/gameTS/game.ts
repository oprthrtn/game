class Game {
    private heroesArray : Character[];
    private choosenHero : Character;

    private enemiesArray : Unit[];
    private enemiesField: Unit[];
    private choosenEnemy : Unit;

    constructor(){
        this.heroesArray = [new Johnny(), new BattleJoe(), new Token()];
        this.choosenHero = this.heroesArray[0];

        this.enemiesArray = [new Sceleton(), new Spider(), new Orc()];
        this.enemiesField = [new Sceleton(), new Sceleton(), new Sceleton()];
        this.choosenEnemy = this.enemiesField[0];
    }

    public get HeroesArray() : Character[]{
        return this.heroesArray;
    }

    public get ChoosenHero() : Character{
        return this.choosenHero;
    }

    public set ChoosenHero(character : Character){
       this.choosenHero = character;
    }

    public get EnemiesField() : Unit[]{
        return this.enemiesField;
    }

    public get ChoosenEnemy() : Unit{
        return this.choosenEnemy;
    }

    public set ChoosenEnemy(target : Unit){
       this.choosenEnemy = target;
    }

    public ChooseEnemy(ind : number) : void{
        this.choosenEnemy = this.enemiesField[ind];
    }
    
    private Randomizer(max : number) : number{
        return Math.floor(Math.random() * (max));
    }

    public NextStep(): void {
        for(let i = 0 ; i < this.enemiesField.length; i++){
            if(this.enemiesField[i].IsDead === false){
                this.enemiesField[i].MakeMove();
            }
        }

        this.choosenHero.MoveSet.forEach(ability =>{
            ability.CooldownStepCheck();
        });

        this.ChoosenHero.Mp += 10;
        if(this.ChoosenHero.Mp > this.ChoosenHero.MaxMp){
            this.ChoosenHero.Mp = this.ChoosenHero.MaxMp;
        }

        let counter : number = 0;

        for(let i = 0 ; i < this.enemiesField.length; i++){
            if(this.enemiesField[i].IsDead === true){
                counter++;
            }
        }
        
        if(counter === this.enemiesField.length){
            for(let i = 0 ; i < this.enemiesField.length; i++){
                this.enemiesField[i] = Object.create(this.enemiesArray[this.Randomizer(this.enemiesArray.length)]);
            }

            this.choosenHero.Hp = this.choosenHero.MaxHp;
            this.choosenHero.Mp = this.choosenHero.MaxMp;
        }
    }
}



export abstract class Ability {

    protected abilityName : string;
    protected abilityDescription : string;
    protected requiredMP : number;
    protected cooldown : number;
    protected cooldownStep : number;

    constructor(abilityName : string, abilityDescription : string, requiredMP : number, cooldown : number){
        this.abilityName = abilityName;
        this.abilityDescription = abilityDescription;
        this.requiredMP = requiredMP;
        this.cooldown = cooldown;
        this.cooldownStep = cooldown;
    }

    public get AbilityName() : string{
        return this.abilityName;
    }

    public get AbilityDescription() : string{
        return this.abilityDescription;
    }

    public get RequiredMP() : number{
        return this.requiredMP;
    }

    public get Cooldown() : number{
        return this.cooldown;
    }

    public get CooldownStep() : number{
        return this.cooldownStep;
    }

    public set CooldownStep(n : number){
        this.cooldownStep = n;
    }

    public CooldownStepCheck() : void{
        if(this.cooldownStep < this.cooldown){
            this.cooldownStep++;
        }
    }
    
    abstract CastAbility(target : Unit, caster : Unit) : void;
}

class Wideswing extends Ability {

    private damage : number = 25;

    constructor(){
        super("Размашистый удар","Урон по всем врагам ", 40, 4);
        this.abilityDescription = `Урон по всем врагам (${this.damage})`;
    }

    public CastAbility(target : Unit, caster : Unit) : void{
        if(this.requiredMP <= caster.Mp && this.cooldownStep === this.Cooldown){
            this.cooldownStep = 0;
            caster.Mp -= this.requiredMP;

            GameController.EnemiesField.forEach(target => {
                target.Hp -= this.damage;
                target.IsDeadCheck();
            })
        }
    }
}

class Hit extends Ability {

    private damage : number = 15;

    constructor(){
        super("Удар","Урон по одной цели ", 15, 1);
        this.abilityDescription = `Урон по одной цели (${this.damage})`;
    }

    public CastAbility(target : Unit, caster : Unit) : void{
        if(this.requiredMP <= caster.Mp && this.cooldownStep === this.Cooldown){
            this.cooldownStep = 0;
            caster.Mp -= this.requiredMP;
            target.Hp -= this.damage;
            target.IsDeadCheck();
        }
    }
}

class Devouring extends Ability {
    
    constructor(){
        super("Пожирание","Если у цели <= 50% HP, уничтожьте его и прибавьте 20% к максимальному HP и MP", 50, 4);
    }
 
    public CastAbility(target : Unit, caster : Unit) : void{
        if(this.requiredMP <= caster.Mp && this.cooldownStep === this.Cooldown){

            if(target.Hp <= target.MaxHp / 2){
                this.cooldownStep = 0;
                caster.Mp -= this.requiredMP;
                target.Hp -= target.Hp;
                caster.MaxHp += target.MaxHp / 100 * 20;
                caster.MaxMp += target.MaxMp / 100 * 20;
                target.IsDeadCheck();
            }
        }
    }
}

class Heal extends Ability {
 
    constructor(){
        super("Излечение","Потратить (25) MP, восстановить (25) HP", 15, 2);
        this.abilityDescription = `Потратить (${this.RequiredMP}) MP, восстановить (${this.RequiredMP}) HP`;
    }
 
    public CastAbility(target : Unit, caster : Unit) : void{
        if(this.requiredMP <= caster.Mp && caster.Hp <= caster.MaxHp - this.RequiredMP && this.cooldownStep === this.Cooldown){

            this.cooldownStep = 0;
            caster.Mp -= this.requiredMP;
            caster.Hp += this.RequiredMP;

            if(caster.Hp > caster.MaxHp){
                caster.Hp = caster.MaxHp;
            }
        }
    }
}

class GreatHeal extends Heal {
    private heal : number = 40;

    constructor(){
        super();
        this.abilityName = "Великое исцеление";
        this.requiredMP = 30;
        this.cooldown = 3;
        this.cooldownStep = 3;
        this.abilityDescription = `Потратить (${this.RequiredMP}) MP, восстановить (${this.heal}) HP`;
    }
 
    public CastAbility(target : Unit, caster : Unit) : void{
        if(this.requiredMP <= caster.Mp && this.cooldownStep === this.Cooldown){

            this.cooldownStep = 0;
            caster.Mp -= this.requiredMP;
            caster.Hp += this.heal;

            if(caster.Hp > caster.MaxHp){
                caster.Hp = caster.MaxHp;
            }
        }
    }
}

class PassiveHeal extends Ability {
    
    private heal : number = 5;

    constructor(){
        super("Регенерация здоровья","Восстанавливает () HP каждый ход", 0, 1);
        this.abilityDescription = `Восстанавливает (${this.heal}) HP каждый ход`;
    }
 
    public CastAbility(target : Unit, caster : Unit) : void{
        caster.Hp += this.heal;

        if(caster.Hp > caster.MaxHp){
            caster.Hp = caster.MaxHp;
        }
    }
}

class PassiveMana extends Ability {
    
    private mana : number = 5;

    constructor(){
        super("Регенерация маны","Восстанавливает () MP каждый ход", 0, 1);
        this.abilityDescription = `Восстанавливает (${this.mana}) MP каждый ход`;
    }
 
    public CastAbility(target : Unit, caster : Unit) : void{
        caster.Mp += this.mana;

        if(caster.Mp > caster.MaxMp){
            caster.Mp = caster.MaxMp;
        }
    }
}




export abstract class Unit {
    private name : string;

    private hp: number;
    private maxHp : number;

    private mp: number;
    private maxMp : number;

    private moveSet: Ability[]; 
    private isDead : boolean;

    constructor(name : string, maxHp : number, maxMp : number, moveSet : Ability[]) {
        this.name = name;
        this.hp = maxHp;
        this.maxHp = maxHp;
        this.mp = maxMp;
        this.maxMp = maxMp;
        this.moveSet = moveSet;
        this.isDead = false;
    }

    public get Name() : string{
        return this.name;
    }

    public get Hp() : number{
        return this.hp;
    }

    public set Hp(n : number){
        this.hp = n;
    }

    public get MaxHp() : number{
        return this.maxHp;
    }

    public set MaxHp(n : number){
        this.maxHp = n;
    }

    public get Mp() : number{
        return this.mp;
    }

    public set Mp(n : number){
        this.mp = n;
    }

    public get MaxMp() : number{
        return this.maxMp;
    }

    public set MaxMp(n : number){
        this.maxMp = n;
    }

    public get MoveSet() : Ability[]{
        return this.moveSet;
    }

    public get IsDead() : boolean{
        return this.isDead;
    }

    public IsDeadCheck(){
        if(this.hp <= 0){
            this.hp = 0;
            this.isDead = true;
        }
    }

    public MakeMove(): void {
        
    }
}

class Sceleton extends Unit {

    constructor(){
        super("Скелет", 15, 15, [new Hit()]);
    }

    public MakeMove(): void {
        this.MoveSet[0].CastAbility(GameController.ChoosenHero, this);

        this.MoveSet.forEach(move =>{
            move.CooldownStepCheck();
        })
    }
}

class Spider extends Unit {

    constructor(){
        super("Паук", 30, 30, [new Hit(), new Heal(), new PassiveMana()]);
    }

    public MakeMove(): void {

        if(this.Hp <= this.MaxHp / 2){
            this.MoveSet[1].CastAbility(GameController.ChoosenHero, this);
        }

        this.MoveSet[0].CastAbility(GameController.ChoosenHero, this);
        this.MoveSet[2].CastAbility(GameController.ChoosenHero, this);

        this.MoveSet.forEach(move =>{
            move.CooldownStepCheck();
        })
    }
}

class Orc extends Unit {

    constructor(){
        super("Орк", 45, 45, [new Hit(), new Heal(), new PassiveHeal()]);
    }

    public MakeMove(): void {
        if(this.Hp <= this.MaxHp / 2){
            this.MoveSet[1].CastAbility(GameController.ChoosenHero, this);
        }

        this.MoveSet[0].CastAbility(GameController.ChoosenHero, this);
        this.MoveSet[2].CastAbility(GameController.ChoosenHero, this);

        this.MoveSet.forEach(move =>{
            move.CooldownStepCheck();
        })
    }
}



export abstract class Character extends Unit {
    
    private description : string;
    private motto : string;
    
    constructor(name : string, maxHp : number, maxMp : number, moveSet : Ability[], description : string, motto : string) {
        super(name, maxHp, maxMp, moveSet);
        this.description = description;
        this.motto = motto;
    }

    public get Motto() : string{
        return this.motto;
    }

    public get Description() : string{
        return this.description;
    }
}

class Johnny extends Character {
    constructor(){
        super("Джонни", 100, 100, [new Wideswing(), new Hit(), new Heal()], "Привет, я Джонни!", "Plain and simple");
    }
}

class BattleJoe extends Character {
    constructor(){
        super("Тёмный Лорд Боевой Джо", 125, 75, [new Devouring(), new Hit(), new Heal()], "Привет, я Джо!", "Skulls for the skull throne");
    }
}

class Token extends Character {
    constructor(){
        super("Токен", 75, 125, [new Wideswing(), new Hit(), new GreatHeal()], "Привет, я Токен!", "You know why he's here");
    }
}



export let GameController : Game = new Game();
