import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Weatherly — a more thoughtful way to see the weather';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#eaf1fa', padding: '72px', color: '#182e4b', position: 'relative', fontFamily: 'sans-serif' }}>
      <div style={{display:'flex',alignItems:'center',gap:18,fontSize:38,fontWeight:800}}>
        <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:58,height:58,borderRadius:18,background:'#437fe6',color:'#ffffff',fontSize:40}}>☀</span>
        weatherly<span style={{color:'#437fe6'}}>.</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',marginTop:85}}>
        <div style={{display:'flex',color:'#467bcd',fontSize:18,fontWeight:700,letterSpacing:4}}>YOUR DAILY FORECAST</div>
        <div style={{display:'flex',fontSize:80,fontWeight:800,letterSpacing:-4,lineHeight:1.14,marginTop:22}}>Weather, made simple.</div>
        <div style={{display:'flex',fontSize:25,color:'#667f9e',marginTop:25}}>A little more wonder in the everyday forecast.</div>
      </div>
      <div style={{position:'absolute',right:82,top:155,display:'flex',width:235,height:235,borderRadius:'50%',background:'linear-gradient(130deg,#ffe6a2,#f8b55d)',boxShadow:'0 0 0 35px #f6dfb14c, 0 0 0 70px #f6dfb130'}}/>
      <div style={{position:'absolute',right:58,bottom:36,display:'flex',background:'#fff',borderRadius:24,padding:'20px 34px',fontSize:25,color:'#4c6585',boxShadow:'0 10px 30px #1b447620'}}>☀ 24° &nbsp;·&nbsp; Clear skies</div>
    </div>,
    {...size}
  );
}
