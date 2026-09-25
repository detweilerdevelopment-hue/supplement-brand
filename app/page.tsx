'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Plus, Minus, Check, Menu, X } from 'lucide-react';

const questions = [
  ['What is aevra?', 'Aevra is a new supplement brand built around a simple idea: taking care of yourself should feel like a natural part of your day. We’re developing our first daily formula and inviting you along for the journey.'],
  ['When will you launch?', 'We’re still getting the details right. There’s no confirmed launch date yet. Join the list and you’ll hear from us when our first release is ready.'],
  ['What’s in the formula?', 'Our formula is in development. Before orders open, we’ll share the complete ingredient list, serving details, and suitability information so you can make an informed choice.'],
  ['What happens when I join the list?', 'You’ll receive aevra development updates and a launch announcement. Joining is free, doesn’t reserve a product, and never commits you to a purchase. You can unsubscribe at any time.'],
];

function Signup({ compact = false }: {compact?: boolean}) {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [message,setMessage] = useState(''); const [unsubscribe,setUnsubscribe] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form=e.currentTarget; const data=new FormData(form); setStatus('loading');
    try { const response=await fetch('/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),company:data.get('company'),consent:true})}); const result=await response.json(); if(!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.'); setUnsubscribe(result.unsubscribe || ''); setStatus('success'); form.reset(); }
    catch(error){setStatus('error');setMessage(error instanceof Error ? error.message : 'Unable to connect. Please try again.');}
  }
  return <div className={compact?'signup compact':'signup'}>{status==='success'?<div className="success" role="status"><Check size={22}/><div><strong>You’re on the list.</strong><span>A little good is coming your way. Stay tuned.</span>{unsubscribe && <a className="removal-link" href={unsubscribe}>Save your private unsubscribe link ↗</a>}</div></div>:<form onSubmit={submit}>
    <label className="sr-only" htmlFor={compact?'email-bottom':'email-top'}>Email address</label>
    <div className="form-row"><input id={compact?'email-bottom':'email-top'} name="email" type="email" autoComplete="email" placeholder="Your email address" required maxLength={254} disabled={status==='loading'}/><button disabled={status==='loading'} type="submit">{status==='loading'?'Joining…':'Get early access'}<ArrowUpRight size={19}/></button></div>
    <input aria-hidden="true" tabIndex={-1} className="honey" name="company" autoComplete="off"/>
    <p className="consent">By joining, you agree to receive aevra emails. Unsubscribe anytime. <a href="/privacy">Privacy policy</a></p>
    {status==='error'&&<p role="alert" className="error">{message}</p>}
  </form>}</div>;
}

const principles = [
  {number:'01',style:'sphere',title:'Purpose in every detail',copy:'A considered approach, from the first ingredient to the everyday ritual.'},
  {number:'02',style:'water',title:'Nothing left unclear',copy:'The complete formula, shared before you decide. Clarity comes first.'},
  {number:'03',style:'orbit',title:'Made for real life',copy:'A small moment of care. Room for the life you already live.'},
  {number:'04',style:'mineral',title:'Carefully developed',copy:'Our first formula is taking shape. Follow the journey from the beginning.'},
];

export default function Home(){
  const [menu,setMenu]=useState(false);const [open,setOpen]=useState<number|null>(0);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="header-band"><header>
      <a href="#" className="logo" aria-label="aevra home">aevra<span>®</span></a>
      <nav aria-label="Main navigation" className={menu?'nav active':'nav'}>
        <a onClick={()=>setMenu(false)} href="#philosophy">Our philosophy</a>
        <a onClick={()=>setMenu(false)} href="#ritual">Our approach</a>
        <a onClick={()=>setMenu(false)} href="#questions">Good questions</a>
      </nav>
      <a className="nav-cta" href="#join">Get early access <ArrowUpRight size={15}/></a>
      <button className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
    </header></div>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-photo" src="/midnight-product.webp" alt="Sapphire-blue aevra Daily One bottle illuminated on dark slate" width="1536" height="1024" fetchPriority="high"/>
        <div className="hero-shade"/>
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> A NEW CHAPTER IN EVERYDAY CARE</div>
          <h1 id="hero-title">Care,<br/><em>considered.</em></h1>
          <p className="intro">A thoughtful new approach to supplements.<br/>A little more intention. A ritual of your own.</p>
          <div className="hero-signup"><Signup/><p className="early-note">FIRST ACCESS. A CLOSER LOOK. YOUR DAILY GOOD.</p></div>
        </div>
        <span className="product-note">PURPOSEFUL DETAILS.<br/>EVERYDAY INTENTION.</span>
        <div className="hero-bottom"><span>01 / DAILY ONE — IN DEVELOPMENT</span><a href="#ritual">Discover the aevra approach <ArrowRight size={15}/></a></div>
      </section>
      <section id="ritual" className="ritual section">
        <div className="section-top"><div><div className="eyebrow">THE AEVRA APPROACH</div><h2>What’s inside <em>matters.</em></h2></div><a className="text-link" href="#questions">A little more clarity <ArrowUpRight size={16}/></a></div>
        <div className="cards">{principles.map(item=><article key={item.number}><div className={'material '+item.style} aria-hidden="true"><div className="material-object"/><span>{item.number} / AEVRA</span></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        <p className="formula-note">Our formula is in development. Full ingredients and serving details will be available before launch.</p>
      </section>
      <section id="philosophy" className="philosophy section"><div><div className="eyebrow">LESS NOISE. MORE INTENTION.</div><h2>A little ritual.<br/>A <em>fuller life.</em></h2></div><div className="philosophy-copy"><p>Feeling good shouldn’t come with a hundred new rules. We believe everyday care can be simpler, quieter, and a little more personal.</p><p>That’s why we’re building aevra. Thoughtfully developed supplements, clear information, and space for the life you already live.</p><span className="signature">Here’s to your kind of good.</span></div></section>
      <section className="story"><img src="/midnight-coast.webp" alt="Moonlight reflected across a quiet ocean between dark coastal cliffs" width="1536" height="1024" loading="lazy"/><div className="story-copy"><div className="eyebrow">MAKE SPACE FOR YOURSELF</div><h2>A brighter tomorrow<br/>starts with a moment<br/><em>of care today.</em></h2><p>For the days you do it all.<br/>And the days you just are.</p><a className="text-link" href="#join">Be part of the beginning <ArrowUpRight size={17}/></a></div><span className="story-caption">A SMALL RITUAL. AN OPEN HORIZON.</span></section>
      <section id="questions" className="faq section"><div><div className="eyebrow">NOTHING LEFT UNCLEAR</div><h2>Good questions.<br/><em>Honest answers.</em></h2></div><div className="questions">{questions.map(([q,a],i)=><div className="question" key={q}><h3><button onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i} aria-controls={'answer-'+i}>{q}{open===i?<Minus size={18}/>:<Plus size={18}/>}</button></h3><div id={'answer-'+i} hidden={open!==i}><p>{a}</p></div></div>)}</div></section>
      <section className="join" id="join"><div className="join-orb" aria-hidden="true"/><div className="eyebrow">BE HERE FROM THE BEGINNING</div><h2>Your daily good.<br/><em>On the horizon.</em></h2><p>Join for first access, thoughtful updates,<br/>and a closer look at what comes next.</p><Signup compact/><span className="join-foot">NO PRESSURE. JUST POSSIBILITY.</span></section>
    </main>
    <footer><div className="footer-top"><a className="logo" href="#">aevra<span>®</span></a><p>Care, considered.</p><a href="/privacy">Privacy & your data <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} aevra. All rights reserved.</span><span>Made with intention. For every day.</span></div><p className="disclaimer">Aevra is in development. Product artwork represents our brand direction; final packaging and formula may change. Content is for general information and is not medical advice.</p></footer>
  </>;
}
