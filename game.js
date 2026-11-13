(() => {
 'use strict';
 const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d');
 const STORE='yarik-accordion-v1',TAU=Math.PI*2;
 const menuArt=new Image(),standingArt=new Image();
 const artReady=Promise.all([[menuArt,'assets/yarik-menu-v3.png'],[standingArt,'assets/yarik-standing-v3.png']].map(([img,path])=>new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;img.src=path})));

 const text={
 ru:{brand:'ЛЕСНЫЕ МЕЛОДИИ',edition:'Маленькое большое приключение',autosave:'Прогресс сохраняется',eyebrow:'У КАЖДОГО ГЕРОЯ СВОЯ МЕЛОДИЯ',yarik:'Ярик',titleRest:'и волшебный<br>аккордеон',intro:'В лесу погасла музыка. Но один маленький аккордеон ещё помнит, как зажигать звёзды.',start:'Навстречу приключению',continue:'Продолжить приключение',restart:'Начать заново',noRush:'Без спешки',ownMusic:'Твоя музыка меняет мир',heroLabel:'Сила не в громкости.',heroLabelSub:'Сила — в твоей мелодии.',world0:'Лес светлячков',world1:'Лунная река',world2:'Звёздная башня',footer:'Стрелки — идти · Пробел — прыгать · E — играть',touchFooter:'Слева — движение · Справа — прыжок и музыка',footerRight:'Волшебство начинается с одной ноты',breath:'МОЖНО ПЕРЕВЕСТИ ДУХ',pauseTitle:'Мир подождёт',pauseText:'Твоя мелодия никуда не исчезнет.',resume:'Продолжить путь',menu:'В главное меню',gateEyebrow:'КАЖДЫЕ ВОРОТА ПОМНЯТ ПЕСНЮ',puzzleTitle:'Разбуди мелодию',tone0:'ДО',tone1:'МИ',tone2:'СОЛЬ',tone3:'ЛЯ',listen:'♫ Послушать ещё раз',puzzleHelp:'Повтори подсвеченные клавиши. Ошибаться можно сколько угодно!',foundNotes:'нот найдено',awakened:'ворот пробуждено',newTitle:'Новое приключение?',newText:'Начнём с первой тропинки. Прошлый прогресс будет сброшен.',yesNew:'Да, с самого начала',cancel:'Оставить как есть',listenNow:'Слушай и смотри, какие клавиши загораются…',repeat:'А теперь твоя очередь!',tryAgain:'Почти получилось! Послушай ещё раз — спешить не нужно.',gateOpen:'Получилось! Лес услышал твою мелодию.',checkpoint:'Снова на тропинку! Всё получится 🙂',gateHint:'E или ♫ — сыграть мелодию',exitHint:'Разбуди все три музыкальных дерева',chapter:'ГЛАВА',firstHint:'Вперёд по тропинке! Пробел или ↑ — прыгнуть.',next:'В следующий мир ↗',worldDone:'МУЗЫКА ВОЗВРАЩАЕТСЯ',worldDoneTitle:'Ещё одна мелодия ожила!',worldDoneText:'Светлячки уже передают её дальше. Следующая тропинка ждёт тебя.',finalEyebrow:'САМОЕ БОЛЬШОЕ ВОЛШЕБСТВО — ВНУТРИ',finalTitle:'Ярик, эта мелодия — для тебя!',finalText:'Ты вернул музыку лесу, реке и звёздам. Пусть твой аккордеон всегда находит дорогу к новым приключениям.',again:'Сыграть ещё раз',muted:'Звук выключен',unmuted:'Звук включён',pause:'Пауза',sound:'Включить или выключить звук',noSave:'Не удалось сохранить прогресс в этом браузере',gate:'ПЕСНЯ ДЕРЕВА',newWorld:'Новая тропинка ждёт!',completedMenu:'Приключение пройдено · можно начать снова'},
 en:{brand:'WOODLAND MELODIES',edition:'A little grand adventure',autosave:'Progress saved',eyebrow:'EVERY HERO HAS A MELODY',yarik:'Yarik',titleRest:'and the magic<br>accordion',intro:'The forest has lost its music. But one little accordion still remembers how to light the stars.',start:'Begin the adventure',continue:'Continue the adventure',restart:'Start again',noRush:'Take your time',ownMusic:'Your music changes the world',heroLabel:'It is not about being loud.',heroLabelSub:'The magic is in your melody.',world0:'Firefly Forest',world1:'Moonlit River',world2:'Star Tower',footer:'Arrows — move · Space — jump · E — play',touchFooter:'Left — move · Right — jump and music',footerRight:'Magic begins with a single note',breath:'TAKE A LITTLE BREATH',pauseTitle:'The world can wait',pauseText:'Your melody will still be here.',resume:'Continue the journey',menu:'Main menu',gateEyebrow:'EVERY GATE REMEMBERS A SONG',puzzleTitle:'Wake the melody',tone0:'DO',tone1:'MI',tone2:'SOL',tone3:'LA',listen:'♫ Listen again',puzzleHelp:'Repeat the glowing keys. You can try as many times as you like!',foundNotes:'notes found',awakened:'gates awakened',newTitle:'A new adventure?',newText:'Start from the first path? Your previous progress will be reset.',yesNew:'Yes, from the beginning',cancel:'Keep my progress',listenNow:'Listen and watch the glowing keys…',repeat:'Now it is your turn!',tryAgain:'Almost! Listen again — there is no rush.',gateOpen:'You did it! The forest heard your melody.',checkpoint:'Back on the path! You can do it 🙂',gateHint:'E or ♫ — play a melody',exitHint:'Awaken all three musical trees',chapter:'CHAPTER',firstHint:'Follow the path! Space or ↑ to jump.',next:'To the next world ↗',worldDone:'THE MUSIC IS RETURNING',worldDoneTitle:'Another melody is alive!',worldDoneText:'The fireflies are carrying it onwards. The next path is waiting for you.',finalEyebrow:'THE GREATEST MAGIC IS WITHIN',finalTitle:'Yarik, this melody is for you!',finalText:'You brought music back to the forest, the river and the stars. May your accordion always lead you to new adventures.',again:'Play again',muted:'Sound off',unmuted:'Sound on',pause:'Pause',sound:'Toggle sound',noSave:'Progress could not be saved in this browser',gate:'TREE SONG',newWorld:'A new path awaits!',completedMenu:'Adventure complete · play again anytime'}
 };
 let lang='ru',sdk=null,save=fresh(),state='menu',level=0,hero={x:120,y:390,vx:0,vy:0,w:30,h:52,dir:1,ground:false},camera=0,viewW=960,viewH=600,clock=0,last=0,frameDt=0,jumpBuffer=0,coyote=0,toastUntil=0,nearGate=-1,puzzle=null,puzzleTimers=[],keyDown=new Set(),particles=[],touch=matchMedia('(pointer:coarse)').matches,started=false,saveWarning=false;
 const palettes=[{top:'#173846',bottom:'#2b5954',mount:'#20504d',far:'#163d43',tree:'#173c39',leaf:'#2b6656',grass:'#80bda1',soil:'#234740',glow:'#c9ec91',accent:'#f0d99f'},{top:'#192d4c',bottom:'#365e78',mount:'#294761',far:'#1e3c52',tree:'#283c5a',leaf:'#466783',grass:'#9ccfd1',soil:'#2b4c65',glow:'#b7e5f1',accent:'#c9deff'},{top:'#272342',bottom:'#58466c',mount:'#3b365a',far:'#312846',tree:'#453751',leaf:'#6d5376',grass:'#c3a3c9',soil:'#493a59',glow:'#f7d8b3',accent:'#f4d08b'}];
 const ground=[[0,680],[770,1450],[1540,2220],[2310,3080]];
 const highPlatforms=[{x:315,y:350,w:100},{x:920,y:330,w:125},{x:1725,y:340,w:120},{x:2480,y:340,w:120}];
 const gateXs=[475,1270,2110];
 const patterns=[[[0,2,1],[1,0,3],[2,1,3]],[[0,1,2,1],[2,0,3,1],[3,2,1,0]],[[0,2,3,1,2],[1,3,2,0,1],[3,1,2,0,3]]];
 const random=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 let coins=[];
 function fresh(){return{version:1,level:0,won:false,muted:false,worlds:Array.from({length:3},()=>({gates:[false,false,false],notes:[]}))}}
 try{const old=JSON.parse(localStorage.getItem(STORE));if(old?.version===1&&old.worlds?.length===3){save=old;save.level=Math.max(0,Math.min(2,Number(old.level)||0));for(const w of save.worlds){if(!Array.isArray(w.gates)||w.gates.length!==3||!Array.isArray(w.notes))throw Error('save');}}}catch{save=fresh()}
 const tr=k=>text[lang][k]??text.ru[k]??k;
 function applyLanguage(l){lang=l==='ru'?'ru':'en';document.documentElement.lang=lang;document.title=lang==='ru'?'Ярик и волшебный аккордеон':'Yarik and the magic accordion';document.querySelectorAll('[data-i18n]').forEach(el=>{const s=tr(el.dataset.i18n);if(el.dataset.i18n==='titleRest')el.innerHTML=s;else el.textContent=s});$('pause').ariaLabel=tr('pause');$('sound').ariaLabel=tr('sound');updateMenu();updateHud();if(touch)$('footer-text').textContent=tr('touchFooter')}
 function persist(){try{localStorage.setItem(STORE,JSON.stringify(save))}catch{if(!saveWarning){saveWarning=true;toast(tr('noSave'))}}}
 const audio={ctx:null,gain:null,muted:save.muted,
  init(){if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.gain=this.ctx.createGain();this.gain.gain.value=this.muted?0:.18;this.gain.connect(this.ctx.destination)}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{})},
  note(i,duration=.32,delay=0,volume=.7){if(!this.ctx||this.ctx.state!=='running'||this.muted)return;const freq=[261.63,329.63,392,440,523.25,659.25][i%6],t=this.ctx.currentTime+delay;for(let h=0;h<3;h++){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=h===0?'triangle':'sine';o.frequency.value=freq*(h===2?2:1);o.detune.value=h===1?5:0;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume*(h===0?.35:.09),t+.035);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.gain);o.start(t);o.stop(t+duration+.03)}},
  coin(){this.note(4,.16,0,.4);this.note(5,.22,.08,.3)},
  chord(){[0,1,2,4].forEach((n,i)=>this.note(n,.65,i*.11,.55))},
  silence(){if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{})},
  toggle(){this.muted=!this.muted;save.muted=this.muted;if(!this.muted)this.init();if(this.gain)this.gain.gain.value=this.muted?0:.18;persist();updateSound();toast(tr(this.muted?'muted':'unmuted'))}
 };
 function updateSound(){$('sound').textContent=audio.muted?'♪̸':'♫';$('sound').setAttribute('aria-pressed',String(!audio.muted))}
 function platformGameplay(on){try{sdk?.features?.GameplayAPI?.[on?'start':'stop']()}catch{}}
 function setState(next){state=next;const active=['playing','puzzle','concert'].includes(next);platformGameplay(active);$('stage').classList.toggle('playing',next!=='menu');$('menu').hidden=next!=='menu';$('hud').hidden=next==='menu';$('pause').hidden=!['playing','puzzle','concert','paused'].includes(next);$('pause-screen').hidden=next!=='paused';$('puzzle-screen').hidden=next!=='puzzle';$('concert-screen').hidden=next!=='concert';$('complete-screen').hidden=next!=='complete';$('touch-controls').hidden=!touch||next!=='playing';if(!active)audio.silence();keyDown.clear();jumpBuffer=0;nearGate=-1;$('hint').hidden=true;updateMenu()}
 function updateMenu(){$('start').querySelector('span').textContent=tr(save.won?'again':started||save.worlds.some(w=>w.gates.some(Boolean)||w.notes.length)?'continue':'start');$('restart').hidden=!save.worlds.some(w=>w.notes.length||w.gates.some(Boolean))&&!save.won;updateSound()}
 function updateHud(){$('chapter').textContent=tr('chapter')+' '+String(level+1).padStart(2,'0')+' / 03';$('world-name').textContent=tr('world'+level);$('notes-count').textContent=save.worlds[level].notes.length;$('runes-count').textContent='✧ '+save.worlds[level].gates.filter(Boolean).length+' / 3'}
 function resetHero(){const gates=save.worlds[level].gates;let x=120;gates.forEach((g,i)=>{if(g)x=gateXs[i]+85});hero={x,y:398,vx:0,vy:0,w:30,h:52,dir:1,ground:true};camera=Math.max(0,Math.min(3080-viewW,x-viewW*.3));jumpBuffer=0;coyote=.12}
 function loadLevel(n){level=n;save.level=n;coins=[];for(let i=0;i<28;i++){const x=170+i*102;if(ground.some(([a,b])=>x>a+20&&x<b-20))coins.push({id:'g'+i,x,y:414})}highPlatforms.forEach((p,i)=>{for(let j=0;j<3;j++)coins.push({id:'h'+i+'-'+j,x:p.x+20+j*28,y:p.y-36})});particles=[];resetHero();updateHud();persist()}
 function start(){audio.init();if(save.won){$('confirm-screen').hidden=false;return}started=true;loadLevel(save.level);setState('playing');audio.init();if(!save.worlds[level].gates.some(Boolean))toast(tr('firstHint'))}
 function newGame(){stopConcertAudio();concert=null;pauseReturn='playing';save=fresh();save.muted=audio.muted;started=true;persist();$('confirm-screen').hidden=true;loadLevel(0);setState('playing');audio.init();toast(tr('firstHint'))}
 function toast(s){$('toast').textContent=s;$('toast').classList.add('visible');toastUntil=performance.now()+3600}
 function burst(x,y,color,count=20){for(let i=0;i<count;i++){const angle=random(i+x+clock)*TAU,speed=35+random(i*9+clock)*115;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-45,t:1,life:.7+random(i*7)*.65,color,r:1.5+random(i)*3})}}
 function jump(){jumpBuffer=.14;audio.init()}
 function update(dt){clock+=dt;frameDt=dt;if(performance.now()>toastUntil)$('toast').classList.remove('visible');for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=55*dt;p.t-=dt/p.life}particles=particles.filter(p=>p.t>0);if(state==='concert'){updateConcert();return}if(state!=='playing')return;
  jumpBuffer-=dt;coyote=hero.ground?.12:coyote-dt;
  let axis=(keyDown.has('ArrowRight')||keyDown.has('KeyD')?1:0)-(keyDown.has('ArrowLeft')||keyDown.has('KeyA')?1:0);hero.vx=axis*265;if(axis)hero.dir=axis;
  if(jumpBuffer>0&&coyote>0){hero.vy=-620;hero.ground=false;coyote=0;jumpBuffer=0;audio.note(2,.12,0,.16);burst(hero.x+15,hero.y+50,palettes[level].grass,6)}
  const previousBottom=hero.y+hero.h;hero.x=Math.max(12,Math.min(3050,hero.x+hero.vx*dt));hero.vy=Math.min(hero.vy+1450*dt,820);hero.y+=hero.vy*dt;hero.ground=false;
  const all=[...ground.map(([a,b])=>({x:a,y:450,w:b-a})),...highPlatforms];if(hero.vy>=0)for(const p of all){if(hero.x+hero.w>p.x&&hero.x<p.x+p.w&&previousBottom<=p.y+2&&hero.y+hero.h>=p.y){hero.y=p.y-hero.h;hero.vy=0;hero.ground=true}}
  nearGate=-1;gateXs.forEach((x,i)=>{if(Math.abs(hero.x+15-x)<96)nearGate=i;if(!save.worlds[level].gates[i]){if(hero.x+hero.w>x-11&&hero.x<x+11){hero.x=x-11-hero.w;hero.vx=0}}});
  for(const c of coins){if(!save.worlds[level].notes.includes(c.id)&&Math.hypot(hero.x+15-c.x,hero.y+25-c.y)<33){save.worlds[level].notes.push(c.id);audio.coin();burst(c.x,c.y,'#f8dc9a',10);persist();updateHud()}}
  if(hero.y>720){resetHero();burst(hero.x+15,hero.y+25,'#addfc9',25);toast(tr('checkpoint'))}
  const show=nearGate>=0||hero.x>2880&&save.worlds[level].gates.some(g=>!g);$('hint').hidden=!show;$('hint').textContent=tr(nearGate>=0?(save.worlds[level].gates[nearGate]?'listenGateHint':'gateHint'):'exitHint');$('music').classList.toggle('ready',nearGate>=0);
  camera+=(Math.max(0,Math.min(3080-viewW,hero.x-viewW*.35))-camera)*Math.min(1,dt*5);
  if(hero.x>2915&&save.worlds[level].gates.every(Boolean))complete();
 }
 function clearPuzzleTimers(){for(const t of puzzleTimers)clearTimeout(t);puzzleTimers=[];document.querySelectorAll('.piano-key').forEach(b=>b.classList.remove('lit'))}
 function later(fn,ms){const id=setTimeout(fn,ms);puzzleTimers.push(id);return id}
 function openPuzzle(){if(state!=='playing'||nearGate<0)return;const gate=nearGate;if(save.worlds[level].gates[gate]){startGateConcert(gate);return}puzzle={gate,sequence:patterns[level][gate],index:0,busy:false,solved:false};setState('puzzle');audio.init();$('puzzle-status').textContent=tr('listenNow');$('sequence-dots').replaceChildren(...puzzle.sequence.map(()=>document.createElement('i')));playSequence()}
 function highlight(n){const b=document.querySelector('[data-tone="'+n+'"]');b.classList.add('lit');later(()=>b.classList.remove('lit'),330)}
 function playSequence(){if(!puzzle||state!=='puzzle')return;clearPuzzleTimers();puzzle.index=0;puzzle.busy=true;$('listen').disabled=true;$('puzzle-status').textContent=tr('listenNow');$('sequence-dots').querySelectorAll('i').forEach(d=>d.classList.remove('done'));puzzle.sequence.forEach((n,i)=>later(()=>{if(state==='puzzle'){audio.note(n,.42);highlight(n)}},400+i*650));later(()=>{if(state==='puzzle'){puzzle.busy=false;$('listen').disabled=false;$('puzzle-status').textContent=tr('repeat')}},650*puzzle.sequence.length+550)}
 function tone(n){if(state!=='puzzle'||!puzzle||puzzle.busy||puzzle.solved)return;audio.init();audio.note(n,.35);highlight(n);if(n!==puzzle.sequence[puzzle.index]){puzzle.index=0;$('sequence-dots').querySelectorAll('i').forEach(d=>d.classList.remove('done'));$('puzzle-status').textContent=tr('tryAgain');return}puzzle.index++;$('sequence-dots').children[puzzle.index-1].classList.add('done');if(puzzle.index===puzzle.sequence.length){puzzle.solved=true;puzzle.busy=true;$('listen').disabled=true;save.worlds[level].gates[puzzle.gate]=true;persist();updateHud();$('puzzle-status').textContent=tr('gateOpen');startGateConcert(puzzle.gate)}}
 function closePuzzle(){clearPuzzleTimers();puzzle=null;setState('playing');audio.init()}
 // Music rewards use the same AudioContext clock for sound, score and key lights.
 Object.assign(text.ru,{concertEyebrow:'МУЗЫКА ТВОЕЙ ПОБЕДЫ',finalMusicEyebrow:'ЭТА МЕЛОДИЯ СОЧИНЕНА ДЛЯ ТЕБЯ',concertReplay:'♫ Ещё раз',concertContinue:'Продолжить путь ↗',concertHelp:'Звучащая нота светится на нотном стане и на клавиатуре.',concertSkip:'Пропустить музыку',concertDone:'Мелодия сыграна. Можно послушать ещё раз.',concertExcerpt:'Фрагмент мелодии · адаптация для аккордеона',concertOriginal:'Вальс для Ярика · 24 такта',concertFragment:'часть',concertFinalReplay:'♫ Послушать свою мелодию',listenGateHint:'E или ♫ — послушать мелодию'});
 Object.assign(text.en,{concertEyebrow:'THE MUSIC OF YOUR VICTORY',finalMusicEyebrow:'THIS MELODY WAS WRITTEN FOR YOU',concertReplay:'♫ Play again',concertContinue:'Continue the journey ↗',concertHelp:'The sounding note lights up on the score and keyboard.',concertSkip:'Skip the music',concertDone:'The melody is finished. You can listen again.',concertExcerpt:'Melody excerpt · accordion adaptation',concertOriginal:'A waltz for Yarik · 24 bars',concertFragment:'part',concertFinalReplay:'♫ Listen to your melody',listenGateHint:'E or ♫ — listen to the melody'});
 let concert=null,pauseReturn='playing';
 const SVGN='http://www.w3.org/2000/svg';
 const noteSyllables={ru:['До','Ре','Ми','Фа','Соль','Ля','Си'],en:['C','D','E','F','G','A','B']};
 const pitchMap=[{d:0,a:''},{d:0,a:'♯'},{d:1,a:''},{d:1,a:'♯'},{d:2,a:''},{d:3,a:''},{d:3,a:'♯'},{d:4,a:''},{d:4,a:'♯'},{d:5,a:''},{d:5,a:'♯'},{d:6,a:''}];
 function noteInfo(midi){const p=pitchMap[midi%12],oct=Math.floor(midi/12)-1;return{name:noteSyllables[lang][p.d]+p.a,midi,acc:p.a,y:120-((oct-4)*7+p.d)*6,oct,latin:['C','D','E','F','G','A','B'][p.d]+(p.a?'#':'')+oct}}
 function musicText(pair){return pair[lang==='ru'?0:1]}
 function svg(tag,attrs,parent,textContent){const el=document.createElementNS(SVGN,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(textContent!==undefined)el.textContent=textContent;if(parent)parent.append(el);return el}
 function stopConcertAudio(){if(!concert)return;for(const node of concert.nodes||[])try{node.stop()}catch{}}
 audio.midi=function(midi,duration,delay=0,volume=.65,absoluteStart=null){
  if(!this.ctx)this.init();const frequency=440*2**((midi-69)/12),t=absoluteStart??this.ctx.currentTime+delay,nodes=[];
  for(let harmonic=0;harmonic<3;harmonic++){
   const o=this.ctx.createOscillator(),g=this.ctx.createGain(),filter=this.ctx.createBiquadFilter();o.type=harmonic===0?'triangle':'sine';o.frequency.value=frequency*(harmonic===2?2:1);o.detune.value=harmonic===1?4:0;filter.type='lowpass';filter.frequency.value=2800;
   const sustain=Math.max(.04,duration-.04),amp=volume*(harmonic===0?.38:.08);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amp,t+.025);g.gain.setValueAtTime(amp*.8,t+sustain*.72);g.gain.exponentialRampToValueAtTime(.0001,t+sustain+.035);o.connect(filter);filter.connect(g);g.connect(this.gain);o.start(t);o.stop(t+sustain+.045);nodes.push(o);
  }return nodes;
 };
 audio.toggle=function(){this.muted=!this.muted;save.muted=this.muted;if(['playing','puzzle','concert'].includes(state))this.init();if(this.gain)this.gain.gain.value=this.muted?0:.18;persist();updateSound();toast(tr(this.muted?'muted':'unmuted'))};
 function renderScore(piece){
  const score=$('concert-score');score.replaceChildren();const width=Math.max(650,135+piece.notes.length*40);score.setAttribute('viewBox','0 0 '+width+' 184');score.setAttribute('width',width);score.style.width=width+'px';
  for(let i=0;i<5;i++)svg('line',{x1:15,y1:60+i*12,x2:width-15,y2:60+i*12,class:'score-line'},score);
  svg('text',{x:22,y:105,fill:'#3e5148','font-family':'Cambria Math,Segoe UI Symbol,serif','font-size':63},score,'𝄞');
  svg('text',{x:72,y:79,fill:'#3e5148','font-family':'Georgia,serif','font-size':21},score,piece.meter[0]);svg('text',{x:72,y:103,fill:'#3e5148','font-family':'Georgia,serif','font-size':21},score,piece.meter[1]);
  let lastBar=-1,accidentals={};
  concert.scoreNodes=piece.notes.map((n,i)=>{
   const x=118+i*40,info=noteInfo(n.midi),bar=Math.floor((n.beat+(piece.measure-(piece.pickup||piece.measure))) /piece.measure);
   if(bar>lastBar){if(i>0)svg('line',{x1:x-23,y1:60,x2:x-23,y2:108,class:'score-bar'},score);accidentals={}}lastBar=bar;
   const g=svg('g',{'class':'score-note','data-note-index':i},score);svg('circle',{cx:x,cy:info.y,r:13,class:'note-halo'},g);
   if(info.y>=120)for(let yy=120;yy<=info.y;yy+=12)svg('line',{x1:x-11,y1:yy,x2:x+11,y2:yy,stroke:'#687467','stroke-width':1},g);
   if(info.y<=48)for(let yy=48;yy>=info.y;yy-=12)svg('line',{x1:x-11,y1:yy,x2:x+11,y2:yy,stroke:'#687467','stroke-width':1},g);
   const accidentalKey=info.oct+':'+pitchMap[n.midi%12].d,mark=info.acc||(accidentals[accidentalKey]==='♯'?'♮':'');accidentals[accidentalKey]=info.acc;
   if(mark)svg('text',{x:x-19,y:info.y+6,'font-size':19,'font-family':'Georgia,serif',class:'note-accidental'},g,mark);
   const hollow=n.beats>=2,stemDown=info.y<=84,stemX=x+(stemDown?-6:6),endY=info.y+(stemDown?31:-31);
   svg('ellipse',{cx:x,cy:info.y,rx:7.2,ry:4.7,transform:'rotate(-18 '+x+' '+info.y+')',class:'note-head'+(hollow?' hollow':'')},g);
   if(n.beats<4){svg('line',{x1:stemX,y1:info.y,x2:stemX,y2:endY,class:'note-stem'},g);if(n.beats<=.5){const direction=stemDown?-1:1;svg('path',{d:'M '+stemX+' '+endY+' q '+(direction*15)+' 8 5 17',fill:'none',class:'note-flag'},g);if(n.beats<=.25)svg('path',{d:'M '+stemX+' '+(endY+(stemDown?-6:6))+' q '+(direction*15)+' 8 5 17',fill:'none',class:'note-flag'},g)}}
   if([.375,.75,1.5,3].some(b=>Math.abs(n.beats-b)<.02))svg('circle',{cx:x+12,cy:info.y-2,r:1.9,class:'note-dot'},g);
   svg('text',{x,y:158,'text-anchor':'middle',class:'note-name'},g,info.name);return{el:g,x};
  });$('score-scroll').scrollLeft=0;
 }
 function renderConcertKeyboard(piece){
  const keyboard=$('concert-keyboard');keyboard.replaceChildren();const pitches=piece.notes.map(n=>n.midi),lo=Math.floor(Math.min(...pitches)/12)*12,hi=Math.floor(Math.max(...pitches)/12)*12+12,whites=[];
  for(let m=lo;m<=hi;m++)if(!pitchMap[m%12].a)whites.push(m);const unit=100/whites.length;let whiteIndex=0;
  for(let midi=lo;midi<=hi;midi++){
   const info=noteInfo(midi),black=!!info.acc,key=document.createElement('div');key.dataset.pitch=midi;key.className=black?'concert-black-key':'concert-white-key';key.style.width=(black?unit*.62:unit)+'%';key.style.left=(black?whiteIndex*unit-unit*.31:whiteIndex*unit)+'%';key.textContent=black?'':info.name;keyboard.append(key);if(!black)whiteIndex++;
  }
 }
 function startConcert(piece,after){
  if(!piece){after();return}stopConcertAudio();clearPuzzleTimers();puzzle=null;audio.init();concert={piece,after,nodes:[],start:audio.ctx.currentTime+.06,elapsed:0,index:-1,done:false};
  $('concert-eyebrow').textContent=tr(piece.original?'finalMusicEyebrow':'concertEyebrow');$('concert-title').textContent=musicText(piece.title);$('concert-composer').textContent=musicText(piece.composer)+(piece.opus?' · '+piece.opus:'');$('concert-caption').textContent=tr(piece.original?'concertOriginal':'concertExcerpt')+(!piece.original?' · '+tr('concertFragment')+' '+piece.fragment:'');
  $('concert-continue').disabled=true;$('concert-replay').disabled=true;$('current-note').textContent='—';$('current-octave').textContent='';$('concert-progress-fill').style.width='0%';document.querySelector('.concert-modal').classList.remove('finished');renderScore(piece);renderConcertKeyboard(piece);setState('concert');audio.init();
  for(const n of piece.notes)concert.nodes.push(...audio.midi(n.midi,Math.min(n.duration*.96,piece.duration-n.start),.06+n.start,.70,concert.start+n.start));
  for(const n of piece.accompaniment||[])concert.nodes.push(...audio.midi(n.midi,n.duration,.06+n.start,n.volume,concert.start+n.start));
  updateConcert();
 }
 function updateConcert(){
  if(!concert||state!=='concert')return;const c=concert,t=Math.max(0,Math.min(c.piece.duration,audio.ctx.currentTime-c.start));c.elapsed=t;const pct=t/c.piece.duration*100;$('concert-progress-fill').style.width=pct+'%';document.querySelector('.concert-progress').setAttribute('aria-valuenow',Math.floor(pct));const remaining=Math.max(0,Math.ceil(c.piece.duration-t));$('concert-time').textContent=Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0');
  const current=c.piece.notes.findIndex(n=>t>=n.start&&t<n.start+n.duration);
  if(current!==c.index){
   c.scoreNodes.forEach((n,i)=>{n.el.classList.toggle('active',i===current);n.el.classList.toggle('past',c.piece.notes[i].start<t)});document.querySelectorAll('#concert-keyboard [data-pitch]').forEach(k=>k.classList.remove('active'));c.index=current;
   if(current>=0){const n=c.piece.notes[current],info=noteInfo(n.midi);$('current-note').textContent=info.name;$('current-octave').textContent=info.latin;const k=$('concert-keyboard').querySelector('[data-pitch="'+n.midi+'"]');k?.classList.add('active');const scroll=$('score-scroll'),target=c.scoreNodes[current].x;if(target<scroll.scrollLeft+85||target>scroll.scrollLeft+scroll.clientWidth-75)scroll.scrollLeft=Math.max(0,target-scroll.clientWidth*.4)}
   else{$('current-note').textContent=t>=c.piece.duration?'✧':'—';$('current-octave').textContent=''}
  }
  if(t>=c.piece.duration&&!c.done){c.done=true;stopConcertAudio();$('concert-continue').disabled=false;$('concert-replay').disabled=false;document.querySelector('.concert-modal').classList.add('finished');$('concert-caption').textContent=tr('concertDone');$('current-note').textContent='✧';$('current-octave').textContent=''}
 }
 function leaveConcert(){if(!concert)return;const after=concert.after;stopConcertAudio();concert=null;after()}
 function startGateConcert(gate){const piece=window.YarikMusic.gates[level*3+gate];startConcert(piece,()=>{setState('playing');audio.init();burst(gateXs[gate],375,palettes[level].glow,45);toast(tr('gateOpen'))})}
 function complete(){if(level===2)startConcert(window.YarikMusic.final,showCompletion);else showCompletion()}
 async function renderConcertPreview(id='final'){
  const piece=id==='final'?window.YarikMusic.final:window.YarikMusic.gates.find(p=>p.id===id),rate=24000;
  const offline=new OfflineAudioContext(1,Math.round(piece.duration*rate),rate),gain=offline.createGain();gain.gain.value=.18;gain.connect(offline.destination);const instrument={ctx:offline,gain};
  for(const n of piece.notes)audio.midi.call(instrument,n.midi,Math.min(n.duration*.96,piece.duration-n.start),0,.70,n.start);
  for(const n of piece.accompaniment||[])audio.midi.call(instrument,n.midi,n.duration,0,n.volume,n.start);
  const rendered=await offline.startRendering(),samples=rendered.getChannelData(0),bytes=new Uint8Array(44+samples.length*2),data=new DataView(bytes.buffer);
  const tag=(offset,s)=>{for(let i=0;i<s.length;i++)data.setUint8(offset+i,s.charCodeAt(i))};tag(0,'RIFF');data.setUint32(4,36+samples.length*2,true);tag(8,'WAVE');tag(12,'fmt ');data.setUint32(16,16,true);data.setUint16(20,1,true);data.setUint16(22,1,true);data.setUint32(24,rate,true);data.setUint32(28,rate*2,true);data.setUint16(32,2,true);data.setUint16(34,16,true);tag(36,'data');data.setUint32(40,samples.length*2,true);
  let peak=0;for(let i=0;i<samples.length;i++){const v=Math.max(-1,Math.min(1,samples[i]));peak=Math.max(peak,Math.abs(v));data.setInt16(44+i*2,Math.round(v*32767),true)}
  let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return{base64:btoa(binary),duration:piece.duration,peak};
 }
 $('concert-continue').onclick=leaveConcert;$('concert-skip').onclick=leaveConcert;$('concert-replay').onclick=()=>{if(concert){const {piece,after}=concert;startConcert(piece,after)}};
 $('final-replay').onclick=()=>startConcert(window.YarikMusic.final,showCompletion);

 function pause(){if(!['playing','puzzle','concert'].includes(state))return;pauseReturn=state==='concert'?'concert':'playing';if(state!=='concert'){clearPuzzleTimers();puzzle=null}setState('paused')}
 function resume(){const target=pauseReturn;pauseReturn='playing';setState(target);audio.init()}
 function menu(){stopConcertAudio();concert=null;pauseReturn='playing';clearPuzzleTimers();puzzle=null;persist();setState('menu');$('confirm-screen').hidden=true}
 function showCompletion(){save.level=Math.min(2,level+1);if(level===2)save.won=true;persist();setState('complete');audio.init();audio.chord();const final=level===2;$('final-replay').hidden=!final;$('complete-eyebrow').textContent=tr(final?'finalEyebrow':'worldDone');$('complete-title').textContent=tr(final?'finalTitle':'worldDoneTitle');$('complete-text').textContent=tr(final?'finalText':'worldDoneText');$('result-notes').textContent=save.worlds.reduce((s,w)=>s+w.notes.length,0);$('result-runes').textContent=save.worlds.reduce((s,w)=>s+w.gates.filter(Boolean).length,0);$('next-level').textContent=tr(final?'again':'next');for(let i=0;i<70;i++)burst(random(i)*viewW+camera,random(i+8)*300,palettes[level].accent,1)}
 $('start').onclick=start;$('restart').onclick=()=>$('confirm-screen').hidden=false;$('confirm-new').onclick=newGame;$('cancel-new').onclick=()=>$('confirm-screen').hidden=true;$('pause').onclick=pause;$('resume').onclick=resume;$('to-menu').onclick=menu;$('end-menu').onclick=menu;$('sound').onclick=()=>audio.toggle();$('close-puzzle').onclick=closePuzzle;$('listen').onclick=()=>{audio.init();playSequence()};$('next-level').onclick=()=>{if(level===2){$('confirm-screen').hidden=false;return}loadLevel(level+1);setState('playing');audio.init();toast(tr('newWorld'))};document.querySelectorAll('[data-tone]').forEach(b=>b.onclick=()=>tone(Number(b.dataset.tone)));
 document.addEventListener('keydown',e=>{if(state!=='playing'&&e.target instanceof HTMLButtonElement&&['Space','Enter'].includes(e.code))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.repeat&&['Space','KeyE','ArrowUp','KeyW'].includes(e.code))return;if(e.code==='Escape'){if(state==='puzzle')closePuzzle();else if(['playing','concert'].includes(state))pause();else if(state==='paused')resume();return}if(state==='puzzle'){const n=['Digit1','Digit2','Digit3','Digit4'].indexOf(e.code);if(n>=0)tone(n);return}if(state!=='playing')return;keyDown.add(e.code);if(['Space','ArrowUp','KeyW'].includes(e.code))jump();if(e.code==='KeyE')openPuzzle()});document.addEventListener('keyup',e=>keyDown.delete(e.code));
 function touchKey(id,key,action){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.classList.add('held');audio.init();if(key)keyDown.add(key);if(action)action()});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>{b.classList.remove('held');if(key)keyDown.delete(key)})}
 touchKey('left','ArrowLeft');touchKey('right','ArrowRight');touchKey('jump',null,jump);touchKey('music',null,openPuzzle);document.addEventListener('contextmenu',e=>{if($('stage').contains(e.target))e.preventDefault()});window.addEventListener('blur',()=>{keyDown.clear();pause()});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 // Hand-painted vector world: no external art, fonts or music are required.
 function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke()}}
 function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=color;ctx.fill()}
 function star(x,y,r,color,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.beginPath();ctx.moveTo(0,-r);ctx.quadraticCurveTo(r*.18,-r*.18,r,0);ctx.quadraticCurveTo(r*.18,r*.18,0,r);ctx.quadraticCurveTo(-r*.18,r*.18,-r,0);ctx.quadraticCurveTo(-r*.18,-r*.18,0,-r);ctx.fillStyle=color;ctx.fill();ctx.restore()}
 function tree(x,y,scale,p,variant=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle=p.tree;ctx.beginPath();ctx.moveTo(-15,0);ctx.quadraticCurveTo(-6,-130,-25,-200);ctx.lineTo(8,-205);ctx.quadraticCurveTo(0,-100,19,0);ctx.fill();ctx.strokeStyle=p.tree;ctx.lineWidth=14;ctx.lineCap='round';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,-110-i*31);ctx.lineTo((i%2?1:-1)*(38+i*7),-160-i*25);ctx.stroke()}if(variant%2){for(let i=0;i<5;i++)ellipse(Math.cos(i*1.4)*50,-210+Math.sin(i*1.4)*35,55,42,p.leaf)}else{ctx.fillStyle=p.leaf;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,-290+i*53);ctx.quadraticCurveTo(-32,-220+i*53,-78+i*14,-150+i*42);ctx.quadraticCurveTo(0,-172+i*42,78-i*14,-150+i*42);ctx.quadraticCurveTo(32,-220+i*53,0,-290+i*53);ctx.fill()}}ctx.restore()}
 function accordion(x,y,size,pulse=0){
  ctx.save();ctx.translate(x,y);ctx.scale(size,size);
  const width=29+pulse*3,left=-width/2,right=width/2;
  const bellows=ctx.createLinearGradient(left,-14,right,18);bellows.addColorStop(0,'#294650');bellows.addColorStop(.48,'#658d83');bellows.addColorStop(1,'#23414b');
  round(left,-16,width,33,3,bellows,'#f0d599');
  for(let i=0;i<7;i++){
   const xx=left+2+i*(width-4)/7;
   ctx.fillStyle=i%2?'#a4c5a6':'#365750';ctx.fillRect(xx,-14,(width-4)/7-1,29);
   ctx.strokeStyle='#d7dec079';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(xx+.8,-11);ctx.lineTo(xx+.8,11);ctx.stroke();
  }
  const end=ctx.createLinearGradient(-24,-19,24,20);end.addColorStop(0,'#3e6775');end.addColorStop(.4,'#254754');end.addColorStop(1,'#173441');
  round(left-13,-21,15,42,5,end,'#efd19a');round(right-2,-21,15,42,5,end,'#efd19a');
  round(left-10,-17,9,34,3,null,'#f1d7a065');round(right+1,-18,9,36,2,'#f8ebca');
  for(let i=1;i<8;i++){const yy=-18+i*4.5;ctx.strokeStyle='#9c9a84';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(right+1,yy);ctx.lineTo(right+10,yy);ctx.stroke();if(![3,7].includes(i)){round(right+1,yy-1,5.2,2.7,.5,'#253542')}}
  for(let row=0;row<4;row++)for(let col=0;col<2;col++){
   ellipse(left-9+col*4,-12+row*8,1.25,1.55,'#e4c48b');ellipse(left-9.3+col*4,-12.4+row*8,.45,.5,'#fff8d8');
  }
  for(const a of [left-9,right+7]){ellipse(a,-18,1,1,'#f6dfab');ellipse(a,18,1,1,'#f6dfab')}
  ctx.strokeStyle='#d6b677';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(left+3,-17);ctx.lineTo(right-3,-17);ctx.moveTo(left+3,18);ctx.lineTo(right-3,18);ctx.stroke();
  ctx.restore();
 }
 function character(x,y,s=1,dir=1,motion=0,heroic=false){
  if(!standingArt.complete||!standingArt.naturalWidth){drawVectorCharacter(x,y,s,dir,motion,heroic);return}
  ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);
  const moving=!!motion,bob=moving?Math.abs(Math.sin(motion*12))*1.6:Math.sin(clock*2.2)*.45;
  ellipse(0,51,17,3.6,'#071b2455');
  ctx.translate(0,bob);ctx.rotate(moving?Math.sin(motion*6)*.026:Math.sin(clock*1.3)*.006);
  const h=80,w=h*standingArt.naturalWidth/standingArt.naturalHeight;
  ctx.drawImage(standingArt,-w*.5,49-h,w,h);
  ctx.restore();
 }
 function drawVectorCharacter(x,y,s=1,dir=1,motion=0,heroic=false){
  ctx.save();ctx.translate(x,y);ctx.scale(s*dir,s);ctx.lineCap='round';ctx.lineJoin='round';
  const stride=Math.sin(motion*12)*3.3,bob=motion?Math.abs(Math.sin(motion*12))*.9:Math.sin(clock*2)*.45,blink=Math.sin(clock*.85)>.994;
  ellipse(0,52,17,3.6,'#071b2455');
  // Trousers and softly rounded boots, with small leather seams.
  ctx.strokeStyle='#27495b';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-6,33);ctx.lineTo(-8+stride,46);ctx.moveTo(6,33);ctx.lineTo(8-stride,46);ctx.stroke();
  for(const [bx,back] of [[-9+stride,true],[9-stride,false]]){
   const shoe=ctx.createLinearGradient(bx-5,44,bx+8,51);shoe.addColorStop(0,'#aa7b51');shoe.addColorStop(.5,'#7b553f');shoe.addColorStop(1,'#4d3d37');
   round(bx-6,43,14,8,[4,5,3,3],shoe);round(bx-6,49,15,2,1,'#d0b289');
   ctx.strokeStyle='#d9b683';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(bx-2,46);ctx.lineTo(bx+3,46);ctx.stroke();
  }
  ctx.translate(0,bob);
  // A soft hood, a tailored coat and a wind-blown scarf.
  ellipse(-2,8,15,11,'#244b4c');
  const coat=ctx.createLinearGradient(-17,10,17,40);coat.addColorStop(0,'#77ad86');coat.addColorStop(.42,'#4e8f73');coat.addColorStop(1,'#2f625d');
  ctx.beginPath();ctx.moveTo(-11,7);ctx.bezierCurveTo(-19,13,-16,29,-20,37);ctx.quadraticCurveTo(-1,45,19,37);ctx.quadraticCurveTo(13,19,12,9);ctx.closePath();ctx.fillStyle=coat;ctx.fill();
  ctx.strokeStyle='#a3c79a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-12,14);ctx.quadraticCurveTo(-11,26,-15,36);ctx.moveTo(-16,37);ctx.quadraticCurveTo(0,42,16,36);ctx.stroke();
  ctx.strokeStyle='#d3d6a272';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,38);ctx.stroke();ellipse(1,33,1.3,1.3,'#e7ca88');
  const flutter=Math.sin(clock*3.3)*3;
  ctx.beginPath();ctx.moveTo(-8,7);ctx.bezierCurveTo(-18,5,-25,1+flutter,-34,3+flutter);ctx.lineTo(-29,9+flutter);ctx.lineTo(-33,13+flutter);ctx.quadraticCurveTo(-18,17,-2,12);ctx.closePath();ctx.fillStyle='#b85f50';ctx.fill();
  ctx.strokeStyle='#df9571';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-10,9);ctx.quadraticCurveTo(-20,9,-29,6+flutter);ctx.stroke();
  round(-10,4,23,8,4,'#d17c58');ellipse(-5,8,3,3,'#a84e44');
  // Ears, a warm shaded face and two expressive eyes in a three-quarter pose.
  ellipse(-12,-5,3,4.5,'#dba37e');ellipse(12,-4,3.4,4.8,'#e6b38a');ellipse(12.3,-4,1.3,2.6,'#bf8069');
  const skin=ctx.createRadialGradient(-5,-10,1,1,-4,22);skin.addColorStop(0,'#ffe0b1');skin.addColorStop(.6,'#f0bd92');skin.addColorStop(1,'#d89576');
  ctx.beginPath();ctx.moveTo(-12,-12);ctx.bezierCurveTo(-14,-23,10,-24,13,-13);ctx.bezierCurveTo(16,2,7,11,-1,10);ctx.bezierCurveTo(-10,9,-15,1,-12,-12);ctx.fillStyle=skin;ctx.fill();
  ellipse(-7,1,3.3,1.7,'#df927a66');ellipse(9,1.5,2.7,1.5,'#dd8a7480');
  for(const eye of [{x:-4.4,y:-6.2},{x:6.4,y:-6.8}]){
   if(blink){ctx.strokeStyle='#57423a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(eye.x-2,eye.y);ctx.quadraticCurveTo(eye.x,eye.y+1.5,eye.x+2,eye.y);ctx.stroke()}
   else{ellipse(eye.x,eye.y,2.8,3.35,'#fff6df');ellipse(eye.x+.65,eye.y+.25,1.75,2.55,'#3d6c65');ellipse(eye.x+1,eye.y+.4,.95,1.9,'#243a3e');ellipse(eye.x+.2,eye.y-.85,.65,.8,'#fffdeb');ctx.strokeStyle='#6c463b';ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(eye.x,eye.y,2.8,3.35,0,Math.PI,TAU);ctx.stroke()}
  }
  ctx.strokeStyle='#6c4539';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-7,-12);ctx.quadraticCurveTo(-4.5,-13.4,-2,-12);ctx.moveTo(4,-12.5);ctx.quadraticCurveTo(6.5,-13.4,9,-11.8);ctx.stroke();
  ctx.strokeStyle='#c28b6c';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(2,-5);ctx.quadraticCurveTo(3.5,-1,5,-1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-2,3);ctx.quadraticCurveTo(3,6.8,8,2.5);ctx.strokeStyle='#a66557';ctx.lineWidth=.9;ctx.stroke();
  ctx.strokeStyle='#fff0c4';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,4);ctx.quadraticCurveTo(3,5.1,5,4);ctx.stroke();
  // Chestnut locks, drawn as separate soft tufts rather than a helmet.
  const hair=ctx.createLinearGradient(-14,-26,13,-1);hair.addColorStop(0,'#9b6643');hair.addColorStop(.35,'#754633');hair.addColorStop(1,'#453334');
  ctx.beginPath();ctx.moveTo(-12,-1);ctx.quadraticCurveTo(-19,-6,-15,-15);ctx.quadraticCurveTo(-20,-21,-10,-24);ctx.quadraticCurveTo(-11,-30,-2,-26);ctx.quadraticCurveTo(6,-31,10,-24);ctx.quadraticCurveTo(19,-24,17,-16);ctx.quadraticCurveTo(20,-9,12,-5);ctx.lineTo(11,-14);ctx.quadraticCurveTo(7,-12,4,-18);ctx.quadraticCurveTo(-2,-11,-8,-13);ctx.quadraticCurveTo(-7,-5,-12,-1);ctx.fillStyle=hair;ctx.fill();
  ctx.strokeStyle='#b47d4b';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-12,-19);ctx.quadraticCurveTo(-8,-25,-1,-22);ctx.moveTo(-6,-17);ctx.quadraticCurveTo(2,-25,8,-21);ctx.moveTo(6,-19);ctx.quadraticCurveTo(13,-23,14,-16);ctx.stroke();
  ctx.strokeStyle='#d3a26377';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-9,-20);ctx.quadraticCurveTo(-5,-23,-1,-21);ctx.moveTo(5,-23);ctx.quadraticCurveTo(8,-24,10,-22);ctx.stroke();
  // Sleeves, wrist cuffs and hands embracing the instrument.
  ctx.strokeStyle='#467b67';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-11,14);ctx.quadraticCurveTo(-18,17,-18,26);ctx.moveTo(11,14);ctx.quadraticCurveTo(19,16,20,25);ctx.stroke();
  ctx.strokeStyle='#b9cb9d';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-19,23);ctx.lineTo(-18,27);ctx.moveTo(18,23);ctx.lineTo(20,26);ctx.stroke();
  accordion(1,25,.68,Math.sin(clock*3.4));
  ellipse(-18,27,3.6,4.2,'#f2c79b');ellipse(19,26,3.4,4,'#f4cba0');
  ctx.strokeStyle='#c28d6c';ctx.lineWidth=.45;for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(-20,26+i*1.6);ctx.lineTo(-17,26+i*1.6);ctx.moveTo(18,25+i*1.6);ctx.lineTo(21,25+i*1.6);ctx.stroke()}
  if(heroic){star(24,-32,4,'#f6d48c',clock*.2);star(-35,-7,2.5,'#b9e5b8',-clock*.3)}
  ctx.restore();
 }

 function background(p,cam,menuScene){const grad=ctx.createLinearGradient(0,0,0,600);grad.addColorStop(0,p.top);grad.addColorStop(1,p.bottom);ctx.fillStyle=grad;ctx.fillRect(0,0,viewW,600);const moonX=menuScene?viewW*(viewW<600?.9:.77):viewW*.78-cam*.025,moonY=menuScene&&viewW<600?65:125;const halo=ctx.createRadialGradient(moonX,moonY,1,moonX,moonY,130);halo.addColorStop(0,p.accent+'22');halo.addColorStop(1,p.accent+'00');ctx.fillStyle=halo;ctx.fillRect(moonX-135,moonY-135,270,270);ellipse(moonX,moonY,40,40,p.accent+'cc');ellipse(moonX+16,moonY-9,36,36,p.top);for(let i=0;i<45;i++){const x=((random(i+5)*1600-cam*.04)% (viewW+80)+viewW+80)%(viewW+80)-40,y=20+random(i+90)*250,a=.25+Math.sin(clock*.6+i)*.15;ctx.globalAlpha=a;star(x,y,1+random(i)*2,p.accent)}ctx.globalAlpha=1;
  for(let layer=0;layer<3;layer++){ctx.fillStyle=[p.mount,p.far,p.tree][layer];ctx.beginPath();ctx.moveTo(-20,650);for(let x=-20;x<viewW+35;x+=20){const world=x+cam*(.08+layer*.13),y=310+layer*50+Math.sin(world*.004+layer)*45+Math.cos(world*.008)*18;ctx.lineTo(x,y)}ctx.lineTo(viewW+30,650);ctx.closePath();ctx.fill()}
  for(let layer=0;layer<2;layer++)for(let i=-1;i<14;i++){const spacing=190+layer*70,x=i*spacing-((cam*(.18+layer*.22))%spacing);tree(x,510+layer*25,.65+layer*.35,{tree:layer?p.tree:p.far,leaf:layer?p.leaf+'88':p.tree},i+layer)}
  if(level===1&&!menuScene){const water=ctx.createLinearGradient(0,470,0,600);water.addColorStop(0,'#69bbcb44');water.addColorStop(1,'#172d4966');ctx.fillStyle=water;ctx.fillRect(0,465,viewW,135);for(let i=0;i<30;i++){const x=(random(i)*viewW+clock*7)%viewW;ctx.fillStyle='#b4e6f02a';ctx.fillRect(x,480+random(i+90)*100,15+random(i+7)*45,1)}}
  if(level===2&&!menuScene){const x=2830-cam*.6;ctx.fillStyle='#312941';ctx.fillRect(x,90,95,400);ctx.beginPath();ctx.moveTo(x-14,100);ctx.lineTo(x+47,-9);ctx.lineTo(x+110,100);ctx.fill();for(let i=0;i<5;i++)round(x+35,130+i*55,24,34,12,'#f1d09a55');star(x+48,3,12,p.accent,clock*.1)}
  for(let i=0;i<28;i++){const x=((random(i+200)*1800-cam*.32+Math.sin(clock*.45+i)*15)%(viewW+60)+viewW+60)%(viewW+60)-30,y=220+random(i+430)*300+Math.sin(clock*.6+i)*12;ctx.globalAlpha=.3+Math.sin(clock*1.4+i)*.25;ellipse(x,y,1.3,1.3,p.glow)}ctx.globalAlpha=1;
 }
 function terrain(p){for(const [a,b] of ground){const x=a-camera;if(x>viewW+100||b-camera< -100)continue;round(x,450,b-a,170,12,p.soil);round(x,448,b-a,13,6,p.grass);ctx.fillStyle=p.leaf;for(let i=0;i<(b-a)/24;i++){const xx=x+12+i*24;ctx.beginPath();ctx.moveTo(xx,450);ctx.lineTo(xx-3,442-random(i+a)*9);ctx.lineTo(xx+2,447);ctx.lineTo(xx+7,440);ctx.lineTo(xx+5,451);ctx.fill()}for(let i=0;i<(b-a)/55;i++){const xx=x+20+i*55;ellipse(xx,477+random(i+a)*60,4+random(i)*8,2,p.grass+'20')}for(let i=0;i<5;i++){const xx=x+50+random(i+a)*Math.max(1,b-a-100);ctx.strokeStyle='#90c4a65a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,450);ctx.lineTo(xx,431);ctx.stroke();ellipse(xx,431,5,3,i%2?p.accent:p.glow)}}
  for(const p2 of highPlatforms){const x=p2.x-camera;round(x,p2.y,p2.w,17,6,p.soil);round(x,p2.y,p2.w,5,3,p.grass);ctx.strokeStyle=p.leaf+'99';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+12+i*25,p2.y+15);ctx.quadraticCurveTo(x+18+i*25,p2.y+43,x+8+i*25,p2.y+53);ctx.stroke()}}
 }
 function musicGate(x,open,index,p){x-=camera;ctx.save();ctx.translate(x,450);ellipse(0,1,38,7,'#081b2855');ctx.strokeStyle=open?p.grass:'#73998f';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-37,-3);ctx.quadraticCurveTo(-43,-126,-12,-148);ctx.quadraticCurveTo(22,-179,48,-134);ctx.quadraticCurveTo(56,-79,40,-2);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=p.accent+(open?'bb':'44');ctx.beginPath();ctx.moveTo(-33,-11);ctx.quadraticCurveTo(-32,-139,1,-143);ctx.stroke();for(let i=0;i<9;i++){const xx=Math.cos(i*1.1)*40,yy=-148+Math.sin(i*1.1)*20;ellipse(xx,yy,12,7,open?p.leaf:p.tree)}if(!open){ctx.fillStyle=p.glow+'18';ctx.fillRect(-30,-114,58,112);for(let i=0;i<4;i++){ctx.strokeStyle=p.glow+(i%2?'55':'88');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-24+i*15,-105);for(let y=-105;y<0;y+=6)ctx.lineTo(-24+i*15+Math.sin(y*.09+clock*2+i)*3,y);ctx.stroke()}}const float=Math.sin(clock*2+index)*3;ellipse(2,-116+float,23,23,open?p.glow+'22':'#152d3dcc');ctx.fillStyle=open?p.accent:p.glow;ctx.font='27px Georgia';ctx.textAlign='center';ctx.fillText(open?'✧':'♫',2,-107+float);ctx.font='8px Trebuchet MS';ctx.fillStyle=p.accent+'aa';ctx.fillText(open?'✦':String(index+1).padStart(2,'0'),0,-178);ctx.restore()}
 function portal(p){const x=2975-camera,active=save.worlds[level].gates.every(Boolean);ctx.save();ctx.translate(x,450);const glow=ctx.createRadialGradient(0,-70,0,0,-70,95);glow.addColorStop(0,p.accent+(active?'44':'11'));glow.addColorStop(1,p.accent+'00');ctx.fillStyle=glow;ctx.fillRect(-100,-170,200,190);round(-33,-134,66,137,[33,33,5,5],p.far,p.accent+(active?'aa':'44'));ctx.strokeStyle=p.accent+(active?'ee':'55');ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-43,-145,86,146,[43,43,5,5]);ctx.stroke();star(0,-96,15,p.accent,clock*.2);for(let i=0;i<6;i++)star(Math.sin(i*7+clock*.3)*22,-20-i*15,2,p.glow);ctx.restore()}
 function draw(){const scale=canvas.height/viewH;ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,viewW,viewH);const menuScene=state==='menu',p=palettes[menuScene?0:level];background(p,menuScene?0:camera,menuScene);
  if(menuScene&&menuArt.complete&&menuArt.naturalWidth){
   const narrow=viewW<600,size=narrow?Math.min(230,viewW*.64):340,cx=viewW*(narrow?.64:.74),bottom=narrow?520:514;
   ctx.save();ctx.translate(cx,bottom);const breathe=Math.sin(clock*1.4)*.7;
   ctx.drawImage(menuArt,-size*.5,-size+breathe,size,size);
   for(let i=0;i<7;i++){const a=clock*.13+i*.91;star(Math.cos(a)*size*.49,-size*.5+Math.sin(a)*size*.44,1.5+random(i)*2,p.accent,a)}
   ctx.restore();return;
  }
  if(menuScene){const mx=viewW*.75,my=424;ctx.save();ctx.translate(mx,my);ellipse(0,57,110,16,'#0a253255');ellipse(0,55,95,11,'#638c6d');ctx.fillStyle='#315d4d';ctx.beginPath();ctx.moveTo(-95,55);ctx.quadraticCurveTo(-70,105,-33,115);ctx.quadraticCurveTo(38,144,94,55);ctx.fill();for(let i=0;i<10;i++){ctx.strokeStyle='#9bc7a455';ctx.beginPath();ctx.moveTo(-85+i*19,52);ctx.lineTo(-88+i*19,45-random(i)*10);ctx.stroke()}character(0,-78,2.8,1,0,true);for(let i=0;i<9;i++){const angle=clock*.15+i*.7;star(Math.cos(angle)*118,-49+Math.sin(angle)*87,2+random(i)*3,p.accent,angle)}ctx.restore();return}
  terrain(p);for(let i=0;i<gateXs.length;i++)musicGate(gateXs[i],save.worlds[level].gates[i],i,p);portal(p);
  for(const c of coins){if(save.worlds[level].notes.includes(c.id))continue;const x=c.x-camera;if(x< -30||x>viewW+30)continue;const y=c.y+Math.sin(clock*2+c.x)*4;ellipse(x,y,11,12,'#f3d58a11');ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(clock+c.x)*.1);ctx.font='26px Georgia';ctx.textAlign='center';ctx.fillStyle='#f2d58e';ctx.shadowColor='#eace7b';ctx.shadowBlur=9;ctx.fillText('♪',0,7);ctx.restore()}
  character(hero.x+15-camera,hero.y+4,1,hero.dir,hero.ground&&hero.vx?clock:0);for(const p2 of particles){ctx.globalAlpha=Math.max(0,p2.t);star(p2.x-camera,p2.y,p2.r,p2.color,clock)}ctx.globalAlpha=1;
 }
 function resize(){const box=$('stage').getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);viewH=600;viewW=box.width/box.height*600;if(state==='playing')camera=Math.max(0,hero.x-viewW*.35)}new ResizeObserver(resize).observe($('stage'));
 function loop(t){const dt=last?Math.min((t-last)/1000,.035):.016;last=t;update(dt);draw();requestAnimationFrame(loop)}
 async function initSDK(){if(location.hostname.endsWith('.github.io')||['localhost','127.0.0.1',''].includes(location.hostname))return;try{await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/sdk.js';script.onload=resolve;script.onerror=reject;document.head.append(script)});sdk=await window.YaGames.init();applyLanguage(sdk.environment?.i18n?.lang||'ru');sdk.on?.('game_api_pause',pause);sdk.on?.('game_api_resume',()=>{});sdk.features.LoadingAPI.ready();if(['playing','puzzle','concert'].includes(state))platformGameplay(true)}catch{/* Local preview and non-platform hosts remain fully playable. */}}
 applyLanguage('ru');resize();loadLevel(save.level);setState('menu');requestAnimationFrame(loop);artReady.then(initSDK);
})();
