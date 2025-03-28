import { useEffect, useState } from "react";
import "./child.css";

const Child = () => {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [newdata, setNewdata] = useState("");

  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState(null);

  // fetch inital todo
  const getData = async () => {
    const test = await fetch("https://dummyjson.com/todos");
    const temp = await test.json();
    console.log(temp);
    setPost(temp.todos.splice(0, 20));
  };

  //  to delete a record
  const handleDelete = async (record) => {
    const url = `https://dummyjson.com/todos/${record.id}`;
    await fetch(url, {
      method: "DELETE",
    });
    const updateRecord = post.filter((item) => item.id !== record.id);
    setPost(updateRecord);
  };

  // to create a new data
  const handleCreate = async () => {
    if (!newdata.trim()) {
      alert("Enter newData");

      return;
    }

    const newField = {
      todo: newdata,
      completed: false,
      userId: 73,
    };

    console.log("new id genrated", newField);

    const response = await fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newField),
    });

    const input = await response.json();
    console.log("create-new-data", input);

    setPost([input, ...post]);
    setNewdata("");
  };

  //to search a record in todo
  const handleSearch = (event) => {
    const findQuery = event.target.value.toLowerCase();
    setSearch(findQuery);

    if (findQuery.length >= 2) {
      const findRecord = post.filter((item) =>
        item?.todo?.toLowerCase().includes(findQuery)
      );
      setPost(findRecord);
    } else {
      getData();
    }
  };

  // updating a todo data

  const onEditInput = (e) => {
    setEditName(e.target.value);
  };

  const handleEdit = async (record) => {
    setEditName(record.todo);
    setEditId(record.id);
    console.log("record to edit", record);
  };

  const handlEditSubmit = async () => {
    const updateFild = {
      id: editId,
      todo: editName,
      completed: false,
      userId: 82,
    };

    const url = `https://dummyjson.com/todos/${editId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateFild),
    });

    const result = await response.json();
    const currentId = result?.message?.match(/'(\d+)'/);
    console.log("check reult", result);
    const updateData = {
      id: currentId,
      todo: editName,
      completed: false,
      userId: 82,
    };

    setPost([updateData, ...post]);

    setEditName("");
    setEditId(null);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="table-section">
      <div className="input-container">
        <input
          type="text"
          id="add"
          value={newdata}
          placeholder="Enter new todo"
          onChange={(e) => setNewdata(e.target.value)}
        />
        <button onClick={handleCreate}>Add todo</button>

        <input
          type="text"
          value={search}
          id="search"
          placeholder="Search data"
          onChange={handleSearch}
        />
        <input
          type="text"
          id="update"
          value={editName}
          placeholder="edit data"
          onChange={onEditInput}
        />
        <button onClick={handlEditSubmit}>Edit record</button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>UserId</th>
              <th>Status</th>
              <th>Action</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {post?.map((item) => {
              return (
                <tr
                  key={item.id}
                  className={item.completed ? "green" : "orange"}
                >
                  <td>{item.id}</td>
                  <td>{item.todo}</td>
                  <td>{item.userId}</td>
                  <td>{item.completed ? "True ✅" : "False ⏳"}</td>
                  <td>
                    <button onClick={() => handleDelete(item)}>DELETE</button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Child;
