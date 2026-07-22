import{b as W,j as r,r as s,g as k,S}from"./index-CNXBunv3.js";import{C as U,b as B,h as D,u as H,Y as G}from"./react-three-fiber.esm-qIT1wdYy.js";const I="#e27533",n=150,d=-3.4,b=3.4,C=7,P=2.4,j=(a,g,v)=>{const i=Math.min(1,Math.max(0,(v-a)/(g-a)));return i*i*(3-2*i)},V=`
  uniform float uSize;
  attribute float aAlpha;
  attribute float aScale;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`,Y=`
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float mask = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, mask * vAlpha * uOpacity);
  }
`,q=({dark:a})=>{const g=s.useRef(null),v=s.useRef(null),i=s.useRef(0),x=s.useRef(a);x.current=a;const{positions:T,alphas:E,scales:O,velocities:w,baseAlpha:R}=s.useMemo(()=>{const e=new Float32Array(n*3),l=new Float32Array(n),o=new Float32Array(n),c=new Float32Array(n),u=new Float32Array(n);for(let t=0;t<n;t++)e[t*3]=(Math.random()-.5)*C,e[t*3+1]=d+Math.random()*(b-d),e[t*3+2]=(Math.random()-.5)*P,o[t]=.6+Math.random()*.9,c[t]=.45+Math.random()*.85,u[t]=.5+Math.random()*.5,l[t]=0;return{positions:e,alphas:l,scales:o,velocities:c,baseAlpha:u}},[]),F=s.useMemo(()=>({uColor:{value:new B(I)},uOpacity:{value:a?.9:.5},uSize:{value:.32}}),[]),y=D(e=>e.gl);return s.useEffect(()=>{const e=y.domElement.closest("section")??y.domElement.parentElement;if(!e)return;k.registerPlugin(S);const l=S.create({trigger:e,start:"top bottom",end:"center center",onUpdate:o=>{i.current=o.progress}});return()=>l.kill()},[y]),H((e,l)=>{const o=g.current,c=v.current;if(!o||!c)return;const u=Math.min(l,.05),t=o.geometry.attributes.position,M=o.geometry.attributes.aAlpha,h=t.array,_=M.array;for(let p=0;p<n;p++){const f=p*3;let A=h[f],m=h[f+1];m+=w[p]*u,A+=-A*.35*u,m>b&&(m=d,A=(Math.random()-.5)*C,h[f+2]=(Math.random()-.5)*P),h[f]=A,h[f+1]=m;const z=j(d,d+1.2,m)*(1-j(b-1.6,b,m));_[p]=z*R[p]}t.needsUpdate=!0,M.needsUpdate=!0;const N=(x.current?.9:.5)*(.45+.55*i.current);c.uniforms.uOpacity.value+=(N-c.uniforms.uOpacity.value)*Math.min(1,u*3)}),r.jsxs("points",{ref:g,children:[r.jsxs("bufferGeometry",{children:[r.jsx("bufferAttribute",{attach:"attributes-position",args:[T,3]}),r.jsx("bufferAttribute",{attach:"attributes-aAlpha",args:[E,1]}),r.jsx("bufferAttribute",{attach:"attributes-aScale",args:[O,1]})]}),r.jsx("shaderMaterial",{ref:v,uniforms:F,vertexShader:V,fragmentShader:Y,transparent:!0,depthWrite:!1,blending:G})]})},L=()=>{const{theme:a}=W();return r.jsx(U,{className:"pointer-events-none",style:{position:"absolute",inset:0,pointerEvents:"none"},camera:{position:[0,0,6],fov:45},dpr:[1,1.75],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},"aria-hidden":"true",children:r.jsx(q,{dark:a==="dark"})})};export{L as default};
