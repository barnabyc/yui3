YUI.add("event-custom-base",function(E){E.Env.evt={handles:{},plugins:{}};(function(){var F=0,G=1;E.Do={objs:{},before:function(I,K,L,M){var J=I,H;if(M){H=[I,M].concat(E.Array(arguments,4,true));J=E.rbind.apply(E,H);}return this._inject(F,J,K,L);},after:function(I,K,L,M){var J=I,H;if(M){H=[I,M].concat(E.Array(arguments,4,true));J=E.rbind.apply(E,H);}return this._inject(G,J,K,L);},_inject:function(H,J,K,M){var N=E.stamp(K),L,I;if(!this.objs[N]){this.objs[N]={};}L=this.objs[N];if(!L[M]){L[M]=new E.Do.Method(K,M);K[M]=function(){return L[M].exec.apply(L[M],arguments);};}I=N+E.stamp(J)+M;L[M].register(I,J,H);return new E.EventHandle(L[M],I);},detach:function(H){if(H.detach){H.detach();}},_unload:function(I,H){}};E.Do.Method=function(H,I){this.obj=H;this.methodName=I;this.method=H[I];this.before={};this.after={};};E.Do.Method.prototype.register=function(I,J,H){if(H){this.after[I]=J;}else{this.before[I]=J;}};E.Do.Method.prototype._delete=function(H){delete this.before[H];delete this.after[H];};E.Do.Method.prototype.exec=function(){var J=E.Array(arguments,0,true),K,I,N,L=this.before,H=this.after,M=false;for(K in L){if(L.hasOwnProperty(K)){I=L[K].apply(this.obj,J);if(I){switch(I.constructor){case E.Do.Halt:return I.retVal;case E.Do.AlterArgs:J=I.newArgs;break;case E.Do.Prevent:M=true;break;default:}}}}if(!M){I=this.method.apply(this.obj,J);}for(K in H){if(H.hasOwnProperty(K)){N=H[K].apply(this.obj,J);if(N&&N.constructor==E.Do.Halt){return N.retVal;}else{if(N&&N.constructor==E.Do.AlterReturn){I=N.newRetVal;}}}}return I;};E.Do.AlterArgs=function(I,H){this.msg=I;this.newArgs=H;};E.Do.AlterReturn=function(I,H){this.msg=I;this.newRetVal=H;};E.Do.Halt=function(I,H){this.msg=I;this.retVal=H;};E.Do.Prevent=function(H){this.msg=H;};E.Do.Error=E.Do.Halt;})();var D="after",B=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],C=9,A="yui:log";E.EventHandle=function(F,G){this.evt=F;this.sub=G;};E.EventHandle.prototype={detach:function(){var F=this.evt,H=0,G;if(F){if(E.Lang.isArray(F)){for(G=0;G<F.length;G++){H+=F[G].detach();}}else{F._delete(this.sub);H=1;}}return H;},monitor:function(F){return this.evt.monitor.apply(this.evt,arguments);}};E.CustomEvent=function(F,G){G=G||{};this.id=E.stamp(this);this.type=F;this.context=E;this.logSystem=(F==A);this.silent=this.logSystem;this.subscribers={};this.afters={};this.preventable=true;this.bubbles=true;this.signature=C;this.subCount=0;this.afterCount=0;this.applyConfig(G,true);};E.CustomEvent.prototype={hasSubs:function(F){var I=this.subCount,G=this.afterCount,H=this.sibling;if(H){I+=H.subCount;G+=H.afterCount;}if(F){return(F=="after")?G:I;}return(I+G);},monitor:function(H){this.monitored=true;var G=this.id+"|"+this.type+"_"+H,F=E.Array(arguments,0,true);F[0]=G;return this.host.on.apply(this.host,F);},getSubs:function(){var H=E.merge(this.subscribers),F=E.merge(this.afters),G=this.sibling;if(G){E.mix(H,G.subscribers);E.mix(F,G.afters);}return[H,F];},applyConfig:function(G,F){if(G){E.mix(this,G,F,B);}},_on:function(J,H,G,F){if(!J){this.log("Invalid callback for CE: "+this.type);}var I=new E.Subscriber(J,H,G,F);if(this.fireOnce&&this.fired){setTimeout(E.bind(this._notify,this,I,this.firedWith),0);}if(F==D){this.afters[I.id]=I;this.afterCount++;}else{this.subscribers[I.id]=I;this.subCount++;}return new E.EventHandle(this,I);},subscribe:function(H,G){var F=(arguments.length>2)?E.Array(arguments,2,true):null;return this._on(H,G,F,true);},on:function(H,G){var F=(arguments.length>2)?E.Array(arguments,2,true):null;this.host._monitor("attach",this.type,{args:arguments});return this._on(H,G,F,true);},after:function(H,G){var F=(arguments.length>2)?E.Array(arguments,2,true):null;return this._on(H,G,F,D);},detach:function(J,H){if(J&&J.detach){return J.detach();}var K=0,G=this.subscribers,F,I;for(F in G){if(G.hasOwnProperty(F)){I=G[F];if(I&&(!J||J===I.fn)){this._delete(I);K++;}}}return K;},unsubscribe:function(){return this.detach.apply(this,arguments);},_notify:function(I,H,F){this.log(this.type+"->"+"sub: "+I.id);var G;G=I.notify(H,this);if(false===G||this.stopped>1){this.log(this.type+" cancelled by subscriber");return false;}return true;},log:function(G,F){if(!this.silent){}},fire:function(){if(this.fireOnce&&this.fired){this.log("fireOnce event: "+this.type+" already fired");return true;}else{var F=E.Array(arguments,0,true);this.fired=true;this.firedWith=F;if(this.emitFacade){return this.fireComplex(F);}else{return this.fireSimple(F);}}},fireSimple:function(F){this.stopped=0;this.prevented=0;if(this.hasSubs()){var G=this.getSubs();this._procSubs(G[0],F);this._procSubs(G[1],F);}this._broadcast(F);return this.stopped?false:true;},fireComplex:function(F){F[0]=F[0]||{};return this.fireSimple(F);},_procSubs:function(I,G,F){var J,H;for(H in I){if(I.hasOwnProperty(H)){J=I[H];if(J&&J.fn){if(false===this._notify(J,G,F)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(G){if(!this.stopped&&this.broadcast){var F=E.Array(G);F.unshift(this.type);if(this.host!==E){E.fire.apply(E,F);}if(this.broadcast==2){E.Global.fire.apply(E.Global,F);}}},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},detachAll:function(){return this.detach();},_delete:function(F){if(F){delete F.fn;delete F.context;delete this.subscribers[F.id];delete this.afters[F.id];}this.host._monitor("detach",this.type,{ce:this,sub:F});}};E.Subscriber=function(H,G,F){this.fn=H;this.context=G;this.id=E.stamp(this);this.args=F;};E.Subscriber.prototype={_notify:function(J,H,I){var F=this.args,G;switch(I.signature){case 0:G=this.fn.call(J,I.type,H,J);break;case 1:G=this.fn.call(J,H[0]||null,J);break;default:if(F||H){H=H||[];F=(F)?H.concat(F):H;G=this.fn.apply(J,F);}else{G=this.fn.call(J);}}if(this.once){I._delete(this);}return G;},notify:function(G,I){var J=this.context,F=true;if(!J){J=(I.contextFn)?I.contextFn():I.context;
}if(E.config.throwFail){F=this._notify(J,G,I);}else{try{F=this._notify(J,G,I);}catch(H){E.error(this+" failed: "+H.message,H);}}return F;},contains:function(G,F){if(F){return((this.fn==G)&&this.context==F);}else{return(this.fn==G);}}};(function(){var F=E.Lang,I=":",J="|",K="~AFTER~",H=E.cached(function(L){return L.replace(/(.*)(:)(.*)/,"*$2$3");}),M=E.cached(function(L,O){if(!O||!F.isString(L)||L.indexOf(I)>-1){return L;}return O+I+L;}),G=E.cached(function(P,R){var O=P,Q,S,L;if(!F.isString(O)){return O;}L=O.indexOf(K);if(L>-1){S=true;O=O.substr(K.length);}L=O.indexOf(J);if(L>-1){Q=O.substr(0,(L));O=O.substr(L+1);if(O=="*"){O=null;}}return[Q,(R)?M(O,R):O,S,O];}),N=function(L){var O=(F.isObject(L))?L:{};this._yuievt=this._yuievt||{id:E.guid(),events:{},targets:{},config:O,chain:("chain" in O)?O.chain:E.config.chain,bubbling:false,defaults:{context:O.context||this,host:this,emitFacade:O.emitFacade,fireOnce:O.fireOnce,queuable:O.queuable,monitored:O.monitored,broadcast:O.broadcast,defaultTargetOnly:O.defaulTargetOnly,bubbles:("bubbles" in O)?O.bubbles:true}};};N.prototype={once:function(){var L=this.on.apply(this,arguments);L.sub.once=true;return L;},on:function(R,W,P,X){var b=G(R,this._yuievt.config.prefix),d,e,O,i,Z,Y,g,T=E.Env.evt.handles,Q,L,U,h=E.Node,a,V,S;this._monitor("attach",b[1],{args:arguments,category:b[0],after:b[2]});if(F.isObject(R)){if(F.isFunction(R)){return E.Do.before.apply(E.Do,arguments);}d=W;e=P;O=E.Array(arguments,0,true);i={};if(F.isArray(R)){S=true;}else{Q=R._after;delete R._after;}E.each(R,function(f,c){if(F.isObject(f)){d=f.fn||((F.isFunction(f))?f:d);e=f.context||e;}O[0]=(S)?f:((Q)?K+c:c);O[1]=d;O[2]=e;i[c]=this.on.apply(this,O);},this);return(this._yuievt.chain)?this:new E.EventHandle(i);}Y=b[0];Q=b[2];U=b[3];if(h&&(this instanceof h)&&(U in h.DOM_EVENTS)){O=E.Array(arguments,0,true);O.splice(2,0,h.getDOMNode(this));return E.on.apply(E,O);}R=b[1];if(this instanceof YUI){L=E.Env.evt.plugins[R];O=E.Array(arguments,0,true);O[0]=U;if(h){a=O[2];if(a instanceof E.NodeList){a=E.NodeList.getDOMNodes(a);}else{if(a instanceof h){a=h.getDOMNode(a);}}V=(U in h.DOM_EVENTS);if(V){O[2]=a;}}if(L){g=L.on.apply(E,O);}else{if((!R)||V){g=E.Event._attach(O);}}}if(!g){Z=this._yuievt.events[R]||this.publish(R);g=Z._on(W,P,(arguments.length>3)?E.Array(arguments,3,true):null,(Q)?"after":true);}if(Y){T[Y]=T[Y]||{};T[Y][R]=T[Y][R]||[];T[Y][R].push(g);}return(this._yuievt.chain)?this:g;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(X,Z,L){var c=this._yuievt.events,R,U=E.Node,b=U&&(this instanceof U);if(!X&&(this!==E)){for(R in c){if(c.hasOwnProperty(R)){c[R].detach(Z,L);}}if(b){E.Event.purgeElement(U.getDOMNode(this));}return this;}var Q=G(X,this._yuievt.config.prefix),W=F.isArray(Q)?Q[0]:null,d=(Q)?Q[3]:null,T,S,a=E.Env.evt.handles,Y,V,P,O=function(g,f){var e=g[f];if(e){while(e.length){T=e.pop();T.detach();}}};if(W){Y=a[W];X=Q[1];if(Y){if(X){O(Y,X);}else{for(R in Y){if(Y.hasOwnProperty(R)){O(Y,R);}}}return this;}}else{if(F.isObject(X)&&X.detach){X.detach();return this;}else{if(b&&((!d)||(d in U.DOM_EVENTS))){V=E.Array(arguments,0,true);V[2]=U.getDOMNode(this);E.detach.apply(E,V);return this;}}}S=E.Env.evt.plugins[d];if(this instanceof YUI){V=E.Array(arguments,0,true);if(S&&S.detach){S.detach.apply(E,V);return this;}else{if(!X||(!S&&U&&(X in U.DOM_EVENTS))){V[0]=X;E.Event.detach.apply(E.Event,V);return this;}}}P=c[Q[1]];if(P){P.detach(Z,L);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(L){return this.detach(L);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(P,Q){var O,S,L,R=this._yuievt.config.prefix;P=(R)?M(P,R):P;this._monitor("publish",P,{args:arguments});if(F.isObject(P)){L={};E.each(P,function(U,T){L[T]=this.publish(T,U||Q);},this);return L;}O=this._yuievt.events;S=O[P];if(S){if(Q){S.applyConfig(Q,true);}}else{S=new E.CustomEvent(P,(Q)?E.mix(Q,this._yuievt.defaults):this._yuievt.defaults);O[P]=S;}return O[P];},_monitor:function(Q,L,R){var O,P=this.getEvent(L);if((this._yuievt.config.monitored&&(!P||P.monitored))||(P&&P.monitored)){O=L+"_"+Q;R.monitored=Q;this.fire.call(this,O,R);}},fire:function(Q){var U=F.isString(Q),P=(U)?Q:(Q&&Q.type),T,O,S=this._yuievt.config.prefix,R,L=(U)?E.Array(arguments,1,true):arguments;P=(S)?M(P,S):P;this._monitor("fire",P,{args:L});T=this.getEvent(P,true);R=this.getSibling(P,T);if(R&&!T){T=this.publish(P);}if(!T){if(this._yuievt.hasTargets){return this.bubble({type:P},L,this);}O=true;}else{T.sibling=R;O=T.fire.apply(T,L);}return(this._yuievt.chain)?this:O;},getSibling:function(L,P){var O;if(L.indexOf(I)>-1){L=H(L);O=this.getEvent(L,true);if(O){O.applyConfig(P);O.bubbles=false;O.broadcast=0;}}return O;},getEvent:function(O,L){var Q,P;if(!L){Q=this._yuievt.config.prefix;O=(Q)?M(O,Q):O;}P=this._yuievt.events;return P[O]||null;},after:function(P,O){var L=E.Array(arguments,0,true);switch(F.type(P)){case"function":return E.Do.after.apply(E.Do,arguments);case"object":L[0]._after=true;break;default:L[0]=K+P;}return this.on.apply(this,L);},before:function(){return this.on.apply(this,arguments);}};E.EventTarget=N;E.mix(E,N.prototype,false,false,{bubbles:false});N.call(E);YUI.Env.globalEvents=YUI.Env.globalEvents||new N();E.Global=YUI.Env.globalEvents;})();},"@VERSION@",{requires:["oop"]});