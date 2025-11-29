import { useEffect, useState } from "react";
import { fetchVideos, saveVideo, deleteVideo } from "../api";

export default function VideoGalleryAdmin(){
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load(){ setList(await fetchVideos()); }
  useEffect(()=>{load()},[]);

  async function save(){
    const fd = new FormData();
    if(editing.id) fd.append('id',editing.id);
    fd.append('title',editing.title || '');
    fd.append('video_url',editing.video_url || '');
    fd.append('description',editing.description || '');
    fd.append('position',editing.position || 0);
    if(editing.thumbnailFile) fd.append('thumbnail', editing.thumbnailFile);
    await saveVideo(fd);
    setEditing(null); load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Video Gallery</h1>
        <button onClick={() => setEditing({id:null,title:'',video_url:'',description:'',position:0})} className="px-3 py-2 rounded bg-yellow-400 text-black">+ Add</button>
      </div>

      {editing && (
        <div className="bg-[#020617] p-4 rounded">
          <input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} placeholder="Title" className="w-full p-2 rounded bg-[#0C1330] mb-2" />
          <input value={editing.video_url} onChange={e=>setEditing({...editing,video_url:e.target.value})} placeholder="YouTube URL" className="w-full p-2 rounded bg-[#0C1330] mb-2" />
          <textarea value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})} placeholder="Description" className="w-full p-2 rounded bg-[#0C1330] mb-2" />
          <input type="file" onChange={e=>setEditing({...editing,thumbnailFile: e.target.files[0]})} className="mb-2" />
          <div>
            <button onClick={save} className="px-3 py-2 rounded bg-green-500 mr-2">Save</button>
            <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded bg-gray-600">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#020617] p-4 rounded">
        <ul>
          {list.map(v => (
            <li key={v.id} className="py-2 border-t border-white/5 flex justify-between items-center">
              <div>
                <div className="font-medium">{v.title}</div>
                <div className="text-xs text-white/60">{v.video_url}</div>
              </div>
              <div>
                <button onClick={() => setEditing(v)} className="mr-3 text-blue-300 text-xs">Edit</button>
                <button onClick={() => { if(confirm('Delete?')) deleteVideo(v.id).then(load) }} className="text-red-300 text-xs">Delete</button>
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="py-6 text-center text-white/60">No videos yet.</li>}
        </ul>
      </div>
    </div>
  );
}
