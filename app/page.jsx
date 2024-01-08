"use client";
import db from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getStorage, getDownloadURL } from "firebase/storage";
import { useEffect, useRef, useState } from "react";

import "../styles/globals.css";

export default function Home() {
  const [detail, setDetail] = useState([]);
  const [users, setUsers] = useState([]);

  const details = collection(db, "digilab");
  const getDetails = async () => {
    const snapshot = await getDocs(details);

    snapshot.forEach((doc) => {
      setDetail([{ id: doc.id, ...doc.data() }]);
    });
  };

  const subscribers = collection(db, "subscribers");

  const getUsers = async () => {
    const snapshot = await getDocs(subscribers);
    console.log(snapshot.size);
    const emails = [];
    snapshot.docs.forEach((doc) => {
      emails.push({ id: doc.id, ...doc.data() });
    });
    setUsers(emails);
  };

  const email = useRef("");

  const subscribeEmail = async (event) => {
    event.preventDefault();
    await addDoc(subscribers, {
      email: email.current.value,
    });
    email.current.value = "";
  };

  const btnText = useRef("");
  const updateBtnText = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, "digilab", "frontend"), {
      btn: btnText.current.value,
    });
    btnText.current = "";
  };

  const logo = useRef("");

  const getImageFile = (event) => {
    logo.current = event.target.files[0];
  };

  const updateLogo = async (event) => {
    event.preventDefault();
    const storageRef = ref(getStorage(), `/files/${logo.current.name}`);
    uploadBytes(storageRef, logo.current).then((snapshot) => {
      alert("Uploaded a blob or file!");
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        updateDoc(doc(db, "digilab", "frontend"), {
          logo: downloadURL,
        });
      });
    });
    logo.current = "";
  };

  useEffect(() => {
    getDetails();
  }, [updateBtnText]);

  useEffect(() => {
    getUsers();
  }, [subscribeEmail]);

  return (
    <main>
      <nav className="bg-zinc-900 p-4 font-[500] text-xl border-b">
        Admin Panel
      </nav>
      <div className="p-8">
        <h2 className="text-2xl font-[600] mb-4">Front-end details</h2>
        {detail.map((data) => (
          <div className="flex items-center justify-between" key={data.id}>
            <img
              className="w-16 h-16 rounded-full "
              src={data.logo}
              alt="logo"
            />
            <button className="py-1.5 px-4 rounded-md bg-blue-500">
              {data.btn}
            </button>
          </div>
        ))}
        <h2 className="text-2xl font-[600] mb-4">Subscribers</h2>
        <table className="mb-4">
          <thead>
            <tr>
              <th className="w-40 border px-2 py-1">ID</th>
              <th className="w-40 border px-2 py-1">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="w-40 border  px-2 py-1">{user.id}</td>
                <td className="w-40 border  px-2 py-1">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-2xl font-[600] mb-4">Subscribe Newsletter</h2>
        <form className="flex gap-4 mb-4" onSubmit={subscribeEmail}>
          <input
            className="py-1 px-2 rounded w-60 bg-transparent border"
            ref={email}
            placeholder="Enter email"
            type="text"
            required
          />
          <button className="bg-zinc-700 hover:bg-zinc-800 active:scale-95 transition-transform py-1 px-3 rounded">
            Submit
          </button>
        </form>
        <h2 className="text-2xl font-[600] mb-4">Update Btn</h2>
        <form className="flex gap-4 mb-4" onSubmit={updateBtnText}>
          <input
            className="py-1 px-2 rounded w-60 bg-transparent border"
            ref={btnText}
            placeholder="Enter button text"
            type="text"
            required
          />
          <button className="bg-zinc-700 hover:bg-zinc-800 active:scale-95 transition-transform py-1 px-3 rounded">
            Submit
          </button>
        </form>
        <h2 className="text-2xl font-[600] mb-4">Update logo</h2>
        <form className="flex gap-4 mb-4" onSubmit={updateLogo}>
          <input
            className="py-1 px-2 rounded w-60 bg-transparent border"
            onChange={getImageFile}
            placeholder="Enter url"
            type="file"
            required
          />
          <button className="bg-zinc-700 hover:bg-zinc-800 active:scale-95 transition-transform py-1 px-3 rounded">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
