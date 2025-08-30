// script.js (type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getStorage,
  ref as sref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ========== Firebase config (use your project config) ========== */
const firebaseConfig = {
  apiKey: "AIzaSyA8eyBxqjjLuUulCdCVV9j5kQGn0AV9Eyw",
  authDomain: "my-website-e8ac5.firebaseapp.com",
  projectId: "my-website-e8ac5",
  storageBucket: "my-website-e8ac5.firebasestorage.app",
  messagingSenderId: "641889905546",
  appId: "1:641889905546:web:73c5d6e7b67da2205e7673",
  measurementId: "G-DJQE9Q0ZLC"
};

/* ========== Initialize ========== */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

/* ========== UI elems ========== */
const el = id => document.getElementById(id);
const msgBox = el('msg');
const userMini = el('userMini');

const incomingList = el('incomingList');
const outgoingList = el('outgoingList');
const friendsList = el('friendsList');

const btnSignUp = el('btnSignUp');
const btnLogin = el('btnLogin');
const btnGoogle = el('btnGoogle');
const btnLogout = el('btnLogout');

const btnSendRequest = el('btnSendRequest');
const searchEmail = el('searchEmail');

const messagesDiv = el('messages');
const chatWith = el('chatWith');
const chatControls = el('chatControls');
const btnSend = el('btnSend');
const msgText = el('msgText');
const imgFile = el('imgFile');

let currentUser = null;
let currentChatFriend = null; // {uid, name, email}

/* ========== Helpers ========== */
function showMsg(text, type='success'){
  msgBox.textContent = text;
  msgBox.className = type;
  msgBox.classList.remove('hidden');
  setTimeout(()=> msgBox.classList.add('hidden'), 4000);
}

function uidKey(a,b){
  // deterministic chat/friend key for two uids
  return [a,b].sort().join('_');
}

/* ========== Auth handlers ========== */
btnSignUp.addEventListener('click', async () => {
  const name = el('name').value.trim();
  const email = el('email').value.trim();
  const password = el('password').value;
  if(!name || !email || !password){ showMsg('Fill name,email,password','error'); return; }
  try{
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    const user = uc.user;
    // create user doc in users collection
    await setDoc(doc(db,'users',user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp()
    });
    showMsg('Account created ✔️','success');
  }catch(e){
    showMsg(e.message,'error');
  }
});

btnLogin.addEventListener('click', async () => {
  const email = el('email').value.trim();
  const password = el('password').value;
  if(!email || !password){ showMsg('Enter email & password','error'); return; }
  try{
    await signInWithEmailAndPassword(auth, email, password);
    showMsg('Logged in ✔️','success');
  }catch(e){
    showMsg(e.message,'error');
  }
});

btnGoogle.addEventListener('click', async ()=>{
  try{
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    // ensure user doc exists
    const uRef = doc(db,'users',user.uid);
    const s = await getDoc(uRef);
    if(!s.exists()){
      await setDoc(uRef, { uid: user.uid, name: user.displayName || '', email: user.email, photoURL: user.photoURL, createdAt: serverTimestamp() });
    }
    showMsg('Google sign-in success','success');
  }catch(e){
    showMsg(e.message,'error');
  }
});

btnLogout.addEventListener('click', async ()=>{
  await signOut(auth);
  showMsg('🚪 Logged out!','success');
});

/* ========== On auth state change ========= */
onAuthStateChanged(auth, async user => {
  currentUser = user;
  if(user){
    userMini.textContent = `${user.email}`;
    // start listening to requests and friends
    startListeners(user.uid);
  } else {
    userMini.textContent = 'Not signed in';
    stopListeners();
    clearUI();
  }
});

/* ========== Firestore listeners (incoming/outgoing requests, friends) ========== */
let unsubIncoming=()=>{};
let unsubOutgoing=()=>{};
let unsubFriends=()=>{};
let unsubMessages=()=>{};

function startListeners(uid){
  // incoming requests: where toUid == uid and status == 'pending'
  const qIn = query(collection(db,'friend_requests'), where('toUid','==', uid), where('status','==','pending'));
  unsubIncoming = onSnapshot(qIn, snap=>{
    incomingList.innerHTML = '';
    snap.forEach(d=>{
      const r = d.data();
      const elReq = document.createElement('div');
      elReq.className = 'request';
      elReq.innerHTML = `<div><strong>${r.fromName||r.fromEmail}</strong><div class="muted">${r.fromEmail}</div></div>
        <div class="actions">
          <button data-id="${d.id}" data-action="accept">Accept</button>
          <button data-id="${d.id}" data-action="reject">Reject</button>
        </div>`;
      incomingList.appendChild(elReq);
    });
  });

  // outgoing requests: where fromUid == uid
  const qOut = query(collection(db,'friend_requests'), where('fromUid','==', uid));
  unsubOutgoing = onSnapshot(qOut, snap=>{
    outgoingList.innerHTML = '';
    snap.forEach(d=>{
      const r = d.data();
      const elReq = document.createElement('div');
      elReq.className = 'request';
      elReq.innerHTML = `<div><strong>${r.toName||r.toEmail}</strong><div class="muted">${r.toEmail}</div></div>
        <div class="actions"><button data-id="${d.id}" data-action="cancel">Cancel</button></div>`;
      outgoingList.appendChild(elReq);
    });
  });

  // friends list: query friends collection where participants array contains uid
  const qFriends = query(collection(db,'friends'), where('participants', 'array-contains', uid));
  unsubFriends = onSnapshot(qFriends, async snap=>{
    friendsList.innerHTML = '';
    snap.forEach(async d=>{
      const data = d.data();
      // determine friend uid and name
      const friendUid = data.participants.filter(x=>x !== uid)[0];
      // get user's doc
      const udoc = await getDoc(doc(db,'users',friendUid));
      const name = udoc.exists() ? udoc.data().name || udoc.data().email : friendUid;
      const elF = document.createElement('div');
      elF.className = 'friend';
      elF.innerHTML = `<div><strong>${name}</strong><div class="muted">${udoc.exists()?udoc.data().email:''}</div></div>
        <div><button data-uid="${friendUid}" data-action="chat">Chat</button></div>`;
      friendsList.appendChild(elF);
    });
  });
}

/* stop listeners on logout */
function stopListeners(){
  unsubIncoming(); unsubOutgoing(); unsubFriends(); unsubMessages();
}

/* clear UI */
function clearUI(){
  incomingList.innerHTML = '';
  outgoingList.innerHTML = '';
  friendsList.innerHTML = '';
  messagesDiv.innerHTML = '';
  chatWith.textContent = 'Select a friend to chat';
  chatControls.classList.add('hidden');
}

/* ========== Friend request flows ========== */

// send friend request by email
btnSendRequest.addEventListener('click', async ()=>{
  if(!currentUser){ showMsg('Login first','error'); return; }
  const toEmail = searchEmail.value.trim().toLowerCase();
  if(!toEmail){ showMsg('Enter friend email','error'); return; }
  if(toEmail === currentUser.email){ showMsg('Cannot add yourself','error'); return; }

  // find user with that email
  const q = query(collection(db,'users'), where('email','==', toEmail));
  const snap = await getDocs(q);
  if(snap.empty){ showMsg('No user with that email','error'); return; }
  const toDoc = snap.docs[0];
  const toUid = toDoc.id;
  const toName = toDoc.data().name || toDoc.data().email;

  // prevent duplicate request or existing friendship
  // check existing friend doc
  const key = uidKey(currentUser.uid, toUid);
  const friendDocRef = doc(db,'friends',key);
  const fSnap = await getDoc(friendDocRef);
  if(fSnap.exists()){ showMsg('Already friends','error'); return; }

  // check existing pending request (from current to them)
  const qDup = query(collection(db,'friend_requests'), where('fromUid','==', currentUser.uid), where('toUid','==', toUid));
  const dupSnap = await getDocs(qDup);
  if(!dupSnap.empty){ showMsg('Request already sent','error'); return; }

  // create request
  try{
    await addDoc(collection(db,'friend_requests'), {
      fromUid: currentUser.uid,
      fromEmail: currentUser.email,
      fromName: (currentUser.displayName || ''),
      toUid,
      toEmail,
      toName,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    showMsg('Request sent','success');
  }catch(e){
    showMsg(e.message,'error');
  }
});

// incoming list click (accept/reject)
incomingList.addEventListener('click', async (ev)=>{
  const btn = ev.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const reqId = btn.dataset.id;
  if(action === 'accept'){
    // accept: set status accepted + create friends doc
    const rRef = doc(db,'friend_requests',reqId);
    const rSnap = await getDoc(rRef);
    if(!rSnap.exists()) return;
    const r = rSnap.data();
    // create friend doc with deterministic id
    const key = uidKey(r.fromUid, r.toUid);
    await setDoc(doc(db,'friends',key), {
      participants: [r.fromUid, r.toUid],
      createdAt: serverTimestamp()
    });
    // update request
    await updateDoc(rRef, { status: 'accepted' });
    showMsg('Friend added','success');
  } else if(action === 'reject'){
    // delete request
    await deleteDoc(doc(db,'friend_requests',reqId));
    showMsg('Request rejected','success');
  }
});

// outgoing cancel
outgoingList.addEventListener('click', async (ev)=>{
  const btn = ev.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const reqId = btn.dataset.id;
  if(action === 'cancel'){
    await deleteDoc(doc(db,'friend_requests',reqId));
    showMsg('Request cancelled','success');
  }
});

/* ========== Chat flows ========== */

friendsList.addEventListener('click', async (ev)=>{
  const btn = ev.target.closest('button');
  if(!btn) return;
  if(btn.dataset.action === 'chat'){
    const friendUid = btn.dataset.uid;
    openChatWith(friendUid);
  }
});

let currentChatUnsub = null;

async function openChatWith(friendUid){
  if(!currentUser){ showMsg('Login first','error'); return; }
  // get friend user doc
  const fDoc = await getDoc(doc(db,'users',friendUid));
  const friendName = fDoc.exists() ? fDoc.data().name || fDoc.data().email : friendUid;
  currentChatFriend = { uid: friendUid, name: friendName };
  chatWith.textContent = `Chat with ${friendName}`;
  chatControls.classList.remove('hidden');
  messagesDiv.innerHTML = '';

  // unsubscribe previous
  if(currentChatUnsub) currentChatUnsub();

  const chatId = uidKey(currentUser.uid, friendUid);
  const messagesCol = collection(db,'chats',chatId,'messages');
  const q = query(messagesCol, orderBy('createdAt'));
  currentChatUnsub = onSnapshot(q, snap=>{
    messagesDiv.innerHTML = '';
    snap.forEach(d=>{
      const m = d.data();
      const el = document.createElement('div');
      el.className = 'msg ' + (m.from === currentUser.uid ? 'me' : 'you');
      el.innerHTML = `<div>${m.text ? escapeHtml(m.text) : ''}${m.imageUrl ? `<br><img src="${m.imageUrl}">` : ''}</div>
        <div class="muted" style="font-size:11px">${new Date(m.createdAt?.toDate ? m.createdAt.toDate() : m.createdAt).toLocaleString()}</div>`;
      messagesDiv.appendChild(el);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// send message (text + optional file)
btnSend.addEventListener('click', async ()=>{
  if(!currentUser || !currentChatFriend){ showMsg('Select friend to chat','error'); return; }
  const text = msgText.value.trim();
  const file = imgFile.files[0];

  const chatId = uidKey(currentUser.uid, currentChatFriend.uid);
  const messagesCol = collection(db,'chats',chatId,'messages');

  try{
    let imageUrl = '';
    if(file){
      // upload to storage
      const path = `chat_images/${chatId}/${Date.now()}_${file.name}`;
      const storageRef = sref(storage, path);
      const snap = await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(snap.ref);
    }

    await addDoc(messagesCol, {
      from: currentUser.uid,
      text: text || '',
      imageUrl: imageUrl || '',
      createdAt: serverTimestamp()
    });

    msgText.value = '';
    imgFile.value = '';
  }catch(e){
    showMsg(e.message,'error');
  }
});

/* ========== Utility ========== */
function escapeHtml(s=''){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }