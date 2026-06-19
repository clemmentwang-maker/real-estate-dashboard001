import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, FileText, BarChart2, Table as TableIcon, TrendingUp, CheckSquare, RefreshCw, Calendar, Users, Database, Link as LinkIcon, DownloadCloud, Loader2, X, Phone, Home, FileSignature, EyeOff, Eye, UserPlus, Save, Edit, UploadCloud, Archive, AlertTriangle, Copy } from 'lucide-react';

export default function App() {
  const defaultDocText = `【本週行動與下週決策】\n\n數據洞察：\n(請填寫本週回顧...)\n\n關鍵指標修正：\n(請填寫...)\n\n重點行動目標：\n1. \n2. \n3. `;

  // 資料結構更新：將 docText (檢討與決策) 放入每一週的資料中
  const [data, setData] = useState([
    { id: 1, date: '2026/06/22', revenue: 0, views: 0, commissions: 0, videos: 0, posts: 0, cumulative: 0, docText: defaultDocText }
  ]);

  const [checklist, setChecklist] = useState([
    { id: 'a1', category: 'A級重點進攻', text: 'A 級買方進度追蹤與新物件配對 (3-5位)', checked: false },
    { id: 'a2', category: 'A級重點進攻', text: 'A 級專任/蘋果件進度推進與議價', checked: false },
    { id: 'a3', category: 'A級重點進攻', text: 'A 級物件屋主深度回報 (數據化回報)', checked: false },
    { id: 'b1', category: 'B/C級農場經營', text: 'B 級客戶(買/賣)電話或Line追蹤暖度', checked: false },
    { id: 'b2', category: 'B/C級農場經營', text: 'C 級客戶喚醒 (發送電子報/市場新訊)', checked: false },
    { id: 'b3', category: 'B/C級農場經營', text: '節慶問候', checked: false },
    { id: 'b4', category: 'B/C級農場經營', text: '客戶追蹤線整理 (剔除無效，升級潛力名單)', checked: false },
    { id: 'c1', category: '行銷曝光與開發', text: '影音內容產出 (開箱/導覽/短影音)', checked: false },
    { id: 'c2', category: '行銷曝光與開發', text: '社群圖文發布 (FB/IG/Line群組)', checked: false },
    { id: 'c3', category: '行銷曝光與開發', text: '廣告素材優化與預算調整 (591/FB等)', checked: false },
  ]);

  const [clients, setClients] = useState([
    { 
      id: 1, name: '王先生', type: '買方', level: 'A', phone: '0912-345-678', lineId: 'wang123', note: '急找美術館三房', isHidden: false,
      logs: [
        { date: '2026/06/18', type: '電話', content: '確認自備款額度約 300 萬，銀行貸款評估中。' },
        { date: '2026/06/15', type: 'Line', content: '傳送美術皇居物件連結及環景，客戶已讀。' }
      ],
      viewings: [
        { date: '2026/06/19', property: '美術皇居A棟', feedback: '喜歡採光與公設，但覺得開價太高，猶豫中。' }
      ],
      offers: [
        { date: '2026/06/20', property: '美術皇居A棟', amount: '1850萬', status: '斡旋洽談中' }
      ]
    },
    { 
      id: 2, name: '林太太', type: '賣方', level: 'A', phone: '0987-654-321', lineId: 'lin_mrs', note: '巨蛋商圈專任約，待回報', isHidden: false,
      logs: [
        { date: '2026/06/17', type: '面訪', content: '簽署專任委託，為期三個月，底價確認。' }
      ],
      viewings: [],
      offers: []
    },
    { 
      id: 3, name: '陳總', type: '買方', level: 'B', phone: '0955-111-222', lineId: 'chen_boss', note: '看農地，預算充裕但不急', isHidden: false,
      logs: [{ date: '2026/05/30', type: 'Line', content: '發送大樹區農地法規變更資訊，保持聯繫。' }], 
      viewings: [], offers: []
    },
    { 
      id: 4, name: '張小姐', type: '賣方', level: 'C', phone: '0933-333-444', lineId: 'chang_c', note: '猶豫中，發送近期實價登錄', isHidden: false,
      logs: [], viewings: [], offers: []
    },
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [showHiddenClients, setShowHiddenClients] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null); 
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); 
  const [newClientForm, setNewClientForm] = useState({
    name: '', type: '買方', level: 'B', phone: '', lineId: '', note: ''
  });

  const [recordFormType, setRecordFormType] = useState(null); 
  const [recordForm, setRecordForm] = useState({});

  const [activeDocId, setActiveDocId] = useState(null);

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  };

  const openRecordForm = (type) => {
    setRecordFormType(type);
    setRecordForm({ date: getTodayDateString(), type: type === 'logs' ? '電話' : undefined }); 
  };

  const handleSaveRecord = (clientId) => {
    if (!recordFormType) return;
    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        return { ...c, [recordFormType]: [recordForm, ...c[recordFormType]] };
      }
      return c;
    });
    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === clientId));
    setRecordFormType(null);
    setRecordForm({});
  };

  const handleDeleteRecord = (clientId, type, index) => {
    const updatedClients = clients.map(c => {
      if (c.id === clientId) {
        const newArr = [...c[type]];
        newArr.splice(index, 1);
        return { ...c, [type]: newArr };
      }
      return c;
    });
    setClients(updatedClients);
    setSelectedClient(updatedClients.find(c => c.id === clientId));
  };

  const [syncUrl, setSyncUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 
  const [syncMessage, setSyncMessage] = useState({ text: '', type: '' });

  const festivals = {
    1: ['元旦 (1/1)', '農曆春節/除夕 (1月底)', '準備新年賀卡與小禮物'],
    2: ['農曆春節', '元宵節 (2/12)', '西洋情人節 (2/14)', '和平紀念日 (2/28)'],
    3: ['白色情人節 (3/14)', '青年節 (3/29)'],
    4: ['兒童節 (4/4)', '清明節 (4/5)'],
    5: ['勞動節 (5/1)', '母親節 (5/10)'],
    6: ['端午節 (6/19)', '年中慶/畢業季'],
    7: ['暑假開始'],
    8: ['父親節 (8/8)', '七夕情人節 (8/19)', '中元節 (8/27)'],
    9: ['中秋節 (9/25)', '教師節 (9/28)'],
    10: ['國慶日 (10/10)', '萬聖節 (10/31)', '台灣光復節 (10/25)'],
    11: ['感恩節 (11/26)'],
    12: ['冬至 (12/22)', '聖誕節/行憲紀念日 (12/25)', '跨年準備']
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentFestivals = festivals[currentMonth] || ['週末愉快問候'];

  useEffect(() => {
    setChecklist(prev => prev.map(item => {
      if (item.id === 'b3') {
        return { ...item, text: `節慶問候發送 (${currentMonth}月: ${currentFestivals.join('、')})` };
      }
      return item;
    }));
  }, [currentMonth]);

  const recalculateData = (currentData) => {
    let currentCumulative = 0;
    return currentData.map(row => {
      currentCumulative += Number(row.revenue) || 0;
      return { ...row, cumulative: currentCumulative };
    });
  };

  const handleDataChange = (id, field, value) => {
    const newData = data.map(row => {
      if (row.id === id) {
        const parsedValue = (field === 'date' || field === 'docText') ? value : Number(value);
        return { ...row, [field]: parsedValue };
      }
      return row;
    });
    setData(recalculateData(newData));
  };

  const addRow = () => {
    const lastDateStr = data.length > 0 ? data[data.length - 1].date : '2026/06/22';
    const lastDate = new Date(lastDateStr);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 7); 
    const formattedDate = `${nextDate.getFullYear()}/${String(nextDate.getMonth() + 1).padStart(2, '0')}/${String(nextDate.getDate()).padStart(2, '0')}`;

    const newRow = {
      id: Date.now(),
      date: formattedDate,
      revenue: 0, views: 0, commissions: 0, videos: 0, posts: 0, cumulative: 0,
      docText: defaultDocText 
    };
    setData(recalculateData([...data, newRow]));
    setActiveDocId(newRow.id);
  };

  const deleteRow = (id) => {
    if (data.length === 1) return;
    const newData = data.filter(row => row.id !== id);
    setData(recalculateData(newData));
    if (activeDocId === id) {
      setActiveDocId(newData[newData.length - 1].id);
    }
  };

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const resetChecklist = () => {
    setChecklist(checklist.map(item => ({ ...item, checked: false })));
  };

  const handleSyncData = async () => {
    if (!syncUrl) {
      setSyncMessage({ text: '請先輸入 Google Apps Script 的 Web App 網址！', type: 'error' });
      return;
    }
    
    setIsSyncing(true);
    setSyncMessage({ text: '正在嘗試連線至 Google Sheets...', type: 'info' });

    try {
      if (syncUrl.includes('script.google.com')) {
        const response = await fetch(syncUrl);
        const jsonData = await response.json();
        
        if (jsonData && jsonData.length > 0) {
          const formattedData = jsonData.map((row, index) => ({
            id: index + 1,
            date: row['日期'] || row['date'] || '',
            revenue: Number(row['業績']) || 0,
            views: Number(row['帶看量']) || 0,
            commissions: Number(row['委託數']) || 0,
            videos: Number(row['影片數']) || 0,
            posts: Number(row['發文數']) || 0,
            docText: row['檢討與行動決策'] || row['docText'] || defaultDocText, 
            cumulative: 0
          }));
          setData(recalculateData(formattedData));
          setActiveDocId(null); 
          setSyncMessage({ text: '✅ 同步成功！已載入雲端資料。', type: 'success' });
        } else {
          setSyncMessage({ text: '⚠️ 連線成功，但試算表中沒有資料或格式不符。', type: 'warning' });
        }
      } else {
        setTimeout(() => {
          setSyncMessage({ text: '❌ 網址格式錯誤，請確認是 Google Apps Script 的網址。', type: 'error' });
          setIsSyncing(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncMessage({ text: '❌ 連線失敗，請檢查網址或試算表權限設定。', type: 'error' });
    }
    
    setIsSyncing(false);
  };

  const handleExportData = async () => {
    if (!syncUrl) {
      setSyncMessage({ text: '請先輸入 Google Apps Script 的 Web App 網址！', type: 'error' });
      return;
    }
    
    setIsExporting(true);
    setSyncMessage({ text: '正在將資料儲存至雲端...', type: 'info' });

    try {
      if (syncUrl.includes('script.google.com')) {
        const payload = {
          action: 'export',
          data: data, 
          clients: clients,
          checklist: checklist
        };

        const response = await fetch(syncUrl, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.status === 'success') {
          setSyncMessage({ text: '✅ 儲存成功！所有資料與決策已同步至雲端。', type: 'success' });
        } else {
          setSyncMessage({ text: '⚠️ 儲存完成，但回傳狀態異常。', type: 'warning' });
        }
      } else {
        setTimeout(() => {
          setSyncMessage({ text: '❌ 網址格式錯誤。', type: 'error' });
          setIsExporting(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Export error:', error);
      setSyncMessage({ text: '✅ 已發送儲存請求 (若有 CORS 警告屬正常，請至試算表確認)', type: 'success' });
    }
    
    setIsExporting(false);
  };

  const handleStartNewWeek = () => {
    addRow(); 
    resetChecklist();
    setSyncMessage({ text: '✨ 已結算並開啟全新一週！', type: 'success' });
    setTimeout(() => setSyncMessage({text:'', type:''}), 3000);
  };

  const handleToggleHideClient = (e, id) => {
    e.stopPropagation(); 
    setClients(clients.map(c => c.id === id ? { ...c, isHidden: !c.isHidden } : c));
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientForm.name.trim()) return; 
    
    if (editingClientId) {
      const updatedClients = clients.map(c => 
        c.id === editingClientId ? { ...c, ...newClientForm } : c
      );
      setClients(updatedClients);
      if (selectedClient && selectedClient.id === editingClientId) {
        setSelectedClient({ ...selectedClient, ...newClientForm }); 
      }
    } else {
      const newClient = {
        id: Date.now(),
        ...newClientForm,
        isHidden: false,
        logs: [],
        viewings: [],
        offers: []
      };
      setClients([newClient, ...clients]); 
    }
    
    setIsAddingClient(false);
    setEditingClientId(null);
    setNewClientForm({ name: '', type: '買方', level: 'B', phone: '', lineId: '', note: '' }); 
  };

  const openEditClientMode = (client) => {
    setNewClientForm({
      name: client.name, type: client.type, level: client.level, 
      phone: client.phone, lineId: client.lineId, note: client.note
    });
    setEditingClientId(client.id);
    setIsAddingClient(true);
  };

  const executeDeleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id));
    setDeleteConfirmId(null);
    setSelectedClient(null);
  };
  
  const displayData = data.slice(-6);

  const visibleClients = clients.filter(c => showHiddenClients ? true : !c.isHidden);
  const completedCount = checklist.filter(item => item.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);
  const categories = ['A級重點進攻', 'B/C級農場經營', '行銷曝光與開發'];

  const targetDocId = activeDocId || (data.length > 0 ? data[data.length - 1].id : null);
  const activeRow = data.find(r => r.id === targetDocId) || data[data.length - 1];
  const displayDocText = activeRow ? activeRow.docText : '';
  const displayDocDate = activeRow ? activeRow.date : '';

  const handleCopyPreviousWeekDoc = () => {
    const currentIndex = data.findIndex(r => r.id === targetDocId);
    if (currentIndex > 0) {
      const prevDocText = data[currentIndex - 1].docText;
      handleDataChange(targetDocId, 'docText', prevDocText);
      setSyncMessage({ text: '✅ 已成功複製上一週的決策內容！', type: 'success' });
      setTimeout(() => setSyncMessage({text:'', type:''}), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 font-sans">
      <header className="mb-6 pb-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-indigo-600 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              房地產業務戰情室
            </h1>
            <p className="text-slate-500 mt-1">整合數據追蹤、動態圖表與每週黃金行動檢查單</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
            <Calendar className="text-indigo-500 w-8 h-8" />
            <div>
              <div className="text-xs font-bold text-indigo-800">{currentMonth} 月行銷重點節慶</div>
              <div className="text-sm text-indigo-600">{currentFestivals.join('、')}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-700 min-w-max">
            <Database className="w-5 h-5" />
            <span className="font-semibold">雲端同步設定</span>
          </div>
          <div className="flex-1 w-full flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="請貼上 Google Apps Script 部署後的 Web App URL"
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              value={syncUrl}
              onChange={(e) => setSyncUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleSyncData}
              disabled={isSyncing || isExporting}
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="從雲端載入數據"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
              載入
            </button>
            <button 
              onClick={handleExportData}
              disabled={isSyncing || isExporting}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
              title="將所有資料儲存至雲端"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              儲存
            </button>
          </div>
        </div>
        
        {syncMessage.text && (
          <div className={`text-sm px-4 py-2 rounded-lg ${
            syncMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
            syncMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
            syncMessage.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {syncMessage.text}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <TableIcon className="w-5 h-5" /> 數據引擎 <span className="text-sm font-normal text-slate-500">(最多顯示近6週)</span>
              </h2>
              <button onClick={addRow} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> 新增本週
              </button>
            </div>
            <div className="overflow-x-auto p-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-3 py-2">日期</th>
                    <th className="px-2 py-2">業績(萬)</th>
                    <th className="px-2 py-2">帶看</th>
                    <th className="px-2 py-2">委託</th>
                    <th className="px-2 py-2">影片</th>
                    <th className="px-2 py-2">發文</th>
                    <th className="px-2 py-2 text-indigo-600">累積(萬)</th>
                    <th className="px-2 py-2 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row) => (
                    <tr key={row.id} className={`border-b transition-colors ${targetDocId === row.id ? 'bg-indigo-50/40' : 'bg-white hover:bg-slate-50'}`}>
                      <td className="px-3 py-1.5">
                        <input type="text" value={row.date} onChange={(e) => handleDataChange(row.id, 'date', e.target.value)} className="w-24 bg-transparent border-none focus:ring-2 focus:ring-indigo-500 rounded px-1" />
                      </td>
                      <td className="px-2 py-1.5"><input type="number" value={row.revenue} onChange={(e) => handleDataChange(row.id, 'revenue', e.target.value)} className="w-16 bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" /></td>
                      <td className="px-2 py-1.5"><input type="number" value={row.views} onChange={(e) => handleDataChange(row.id, 'views', e.target.value)} className="w-12 bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" /></td>
                      <td className="px-2 py-1.5"><input type="number" value={row.commissions} onChange={(e) => handleDataChange(row.id, 'commissions', e.target.value)} className="w-12 bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" /></td>
                      <td className="px-2 py-1.5"><input type="number" value={row.videos} onChange={(e) => handleDataChange(row.id, 'videos', e.target.value)} className="w-12 bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" /></td>
                      <td className="px-2 py-1.5"><input type="number" value={row.posts} onChange={(e) => handleDataChange(row.id, 'posts', e.target.value)} className="w-12 bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1" /></td>
                      <td className="px-2 py-1.5 font-bold text-indigo-700 bg-indigo-50/50">{row.cumulative}</td>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setActiveDocId(row.id)} className={`p-1.5 rounded transition-colors ${targetDocId === row.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-200 hover:text-indigo-600'}`} title="檢視此週決策">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteRow(row.id)} disabled={data.length === 1} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30" title="刪除此週紀錄">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <BarChart2 className="w-5 h-5" /> 動態趨勢圖
              </h2>
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  <Line yAxisId="left" type="monotone" dataKey="views" name="帶看" stroke="#10b981" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="commissions" name="委託" stroke="#f59e0b" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="videos" name="影片" stroke="#ec4899" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="業績(萬)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <Users className="w-5 h-5" /> 客戶名單與歷程 <span className="text-sm font-normal text-slate-500">(點擊卡片查看)</span>
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowHiddenClients(!showHiddenClients)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors ${showHiddenClients ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {showHiddenClients ? <Eye className="w-3.5 h-3.5"/> : <EyeOff className="w-3.5 h-3.5"/>}
                  {showHiddenClients ? '隱藏封存名單' : '顯示封存名單'}
                </button>
                <button 
                  onClick={() => setIsAddingClient(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> 新增
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {visibleClients.map(client => (
                 <div 
                   key={client.id} 
                   onClick={() => setSelectedClient(client)}
                   className={`border rounded-lg p-3 flex flex-col gap-2 transition-all cursor-pointer group ${client.isHidden ? 'bg-slate-50 border-slate-200 opacity-60 grayscale' : 'bg-white border-slate-200 hover:shadow-md hover:border-indigo-300'}`}
                 >
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{client.name}</span>
                       <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                         client.level === 'A' ? 'bg-red-100 text-red-700' : 
                         client.level === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                       }`}>
                         {client.level}級 {client.type}
                       </span>
                     </div>
                     <button 
                       onClick={(e) => handleToggleHideClient(e, client.id)}
                       className="text-slate-300 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                       title={client.isHidden ? "取消封存" : "封存客戶"}
                     >
                       {client.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                     </button>
                   </div>
                   <p className="text-sm text-slate-600 line-clamp-1">{client.note}</p>
                   <div className="flex gap-3 text-xs text-slate-400 mt-1 border-t border-slate-50 pt-2">
                     <span className="flex items-center gap-1" title="聯絡紀錄數"><Phone className="w-3.5 h-3.5"/> {client.logs.length}</span>
                     <span className="flex items-center gap-1" title="帶看紀錄數"><Home className="w-3.5 h-3.5"/> {client.viewings.length}</span>
                     <span className="flex items-center gap-1" title="斡旋/成交數"><FileSignature className="w-3.5 h-3.5"/> {client.offers.length}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col max-h-[500px]">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <CheckSquare className="w-5 h-5" /> 本週黃金行動檢查單
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={resetChecklist} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded bg-white border border-slate-200">
                  <RefreshCw className="w-3 h-3" /> 重置
                </button>
                <button onClick={handleStartNewWeek} className="bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded shadow-sm">
                  <Archive className="w-3 h-3" /> 結算並開啟下週
                </button>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex justify-between text-xs mb-1 font-medium text-slate-600">
                <span>任務達成率</span>
                <span>{progressPercent}% ({completedCount}/{checklist.length})</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="overflow-y-auto p-4 flex-1 space-y-4 bg-white">
              {categories.map(category => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{category}</h3>
                  <div className="space-y-1">
                    {checklist.filter(item => item.category === category).map(item => (
                      <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors border border-transparent hover:border-slate-100">
                        <div className="relative flex items-center mt-0.5">
                          <input 
                            type="checkbox" 
                            checked={item.checked}
                            onChange={() => toggleCheck(item.id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm select-none transition-all ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-64 flex flex-col transition-all">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-700">
                <FileText className="w-5 h-5" /> 檢討與決策 ({displayDocDate})
              </h2>
              <button 
                onClick={handleCopyPreviousWeekDoc} 
                disabled={data.findIndex(r => r.id === targetDocId) <= 0}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="將上一週的決策文字複製到目前這週"
              >
                <Copy className="w-3 h-3" /> 複製上週
              </button>
            </div>
            <textarea
              value={displayDocText}
              onChange={(e) => targetDocId && handleDataChange(targetDocId, 'docText', e.target.value)}
              className="flex-1 p-4 w-full border-none focus:ring-0 resize-none text-sm text-slate-700 leading-relaxed bg-slate-50/30"
              placeholder="在這裡寫下您的決策..."
            ></textarea>
          </div>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                {selectedClient.name} 
                <span className="text-sm font-medium px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md ml-2">
                  {selectedClient.type}
                </span>
              </h3>
              <div className="flex items-center gap-1">
                {deleteConfirmId === selectedClient.id ? (
                  <div className="flex items-center gap-2 mr-2 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>確定刪除?</span>
                    <button onClick={() => executeDeleteClient(selectedClient.id)} className="text-xs bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700">刪除</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-slate-500 hover:text-slate-800 px-1 py-0.5">取消</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => openEditClientMode(selectedClient)} className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-1.5 rounded transition-colors" title="編輯客戶資料">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(selectedClient.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors mr-1" title="刪除此客戶">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button 
                  onClick={() => { setSelectedClient(null); setRecordFormType(null); setDeleteConfirmId(null); }} 
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1.5 rounded transition-colors border-l border-slate-200 pl-2 ml-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6 bg-white">
              <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-medium w-16">電話：</span> 
                  <span className="text-slate-700 font-medium">{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-medium w-16">Line ID：</span> 
                  <span className="text-slate-700">{selectedClient.lineId}</span>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-start gap-2 pt-2 border-t border-indigo-100/50">
                  <span className="text-indigo-400 font-medium w-16 flex-shrink-0">需求備註：</span> 
                  <span className="text-slate-700">{selectedClient.note}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-amber-500" /> 斡旋與成交紀錄
                  </h4>
                  <button onClick={() => openRecordForm('offers')} className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded transition-colors">
                    <Plus className="w-3 h-3" /> 新增
                  </button>
                </div>

                {recordFormType === 'offers' && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="物件名稱 (例: 美術皇居)" className="col-span-2 text-sm px-2 py-1.5 border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500" value={recordForm.property || ''} onChange={e=>setRecordForm({...recordForm, property: e.target.value})} />
                      <input type="text" placeholder="金額 (例: 1850萬)" className="text-sm px-2 py-1.5 border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500" value={recordForm.amount || ''} onChange={e=>setRecordForm({...recordForm, amount: e.target.value})} />
                      <input type="text" placeholder="狀態 (例: 洽談中)" className="text-sm px-2 py-1.5 border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500" value={recordForm.status || ''} onChange={e=>setRecordForm({...recordForm, status: e.target.value})} />
                      <input type="text" placeholder="日期 (YYYY/MM/DD)" className="text-sm px-2 py-1.5 border border-amber-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500" value={recordForm.date || ''} onChange={e=>setRecordForm({...recordForm, date: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setRecordFormType(null)} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1">取消</button>
                      <button onClick={() => handleSaveRecord(selectedClient.id)} disabled={!recordForm.property} className="text-xs bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white px-3 py-1 rounded transition-colors">儲存</button>
                    </div>
                  </div>
                )}

                {selectedClient.offers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedClient.offers.map((offer, idx) => (
                      <div key={idx} className="flex justify-between items-start p-3 rounded-lg border border-amber-200 bg-amber-50 shadow-sm relative group">
                        <button onClick={() => handleDeleteRecord(selectedClient.id, 'offers', idx)} className="absolute top-2 right-2 text-amber-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-amber-50 rounded" title="刪除紀錄"><Trash2 className="w-4 h-4"/></button>
                        <div>
                          <div className="font-bold text-amber-900 pr-6">{offer.property}</div>
                          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {offer.date}
                          </div>
                        </div>
                        <div className="text-right mt-1 sm:mt-0">
                          <div className="font-black text-lg text-amber-700">{offer.amount}</div>
                          <div className="text-xs font-bold px-2.5 py-1 bg-amber-500 text-white rounded-full inline-block mt-1">
                            {offer.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400 italic pl-6">目前尚無斡旋或成交紀錄</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <Home className="w-4 h-4 text-emerald-500" /> 看屋與帶看紀錄
                  </h4>
                  <button onClick={() => openRecordForm('viewings')} className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded transition-colors">
                    <Plus className="w-3 h-3" /> 新增
                  </button>
                </div>

                {recordFormType === 'viewings' && (
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 mb-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="帶看物件名稱" className="col-span-2 text-sm px-2 py-1.5 border border-emerald-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" value={recordForm.property || ''} onChange={e=>setRecordForm({...recordForm, property: e.target.value})} />
                      <input type="text" placeholder="日期 (YYYY/MM/DD)" className="text-sm px-2 py-1.5 border border-emerald-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" value={recordForm.date || ''} onChange={e=>setRecordForm({...recordForm, date: e.target.value})} />
                      <textarea placeholder="客戶反饋 (例: 採光好但太貴...)" className="col-span-2 text-sm px-2 py-1.5 border border-emerald-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-16" value={recordForm.feedback || ''} onChange={e=>setRecordForm({...recordForm, feedback: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setRecordFormType(null)} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1">取消</button>
                      <button onClick={() => handleSaveRecord(selectedClient.id)} disabled={!recordForm.property} className="text-xs bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-3 py-1 rounded transition-colors">儲存</button>
                    </div>
                  </div>
                )}

                {selectedClient.viewings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedClient.viewings.map((view, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/50 relative group">
                        <button onClick={() => handleDeleteRecord(selectedClient.id, 'viewings', idx)} className="absolute top-2 right-2 text-emerald-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-emerald-50 rounded" title="刪除紀錄"><Trash2 className="w-4 h-4"/></button>
                        <div className="flex justify-between items-center mb-1 pr-6">
                          <span className="font-bold text-emerald-800">{view.property}</span>
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">{view.date}</span>
                        </div>
                        <div className="text-sm text-slate-600 mt-2 bg-white p-2 rounded border border-emerald-50">
                          <span className="font-medium text-emerald-700 mr-1">客戶反饋：</span>
                          {view.feedback}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400 italic pl-6">尚無帶看紀錄</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" /> 一般聯絡與追蹤紀錄
                  </h4>
                  <button onClick={() => openRecordForm('logs')} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors">
                    <Plus className="w-3 h-3" /> 新增
                  </button>
                </div>

                {recordFormType === 'logs' && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select className="text-sm px-2 py-1.5 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" value={recordForm.type || '電話'} onChange={e=>setRecordForm({...recordForm, type: e.target.value})}>
                        <option value="電話">電話</option>
                        <option value="Line">Line</option>
                        <option value="面訪">面訪</option>
                        <option value="其他">其他</option>
                      </select>
                      <input type="text" placeholder="日期 (YYYY/MM/DD)" className="text-sm px-2 py-1.5 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" value={recordForm.date || ''} onChange={e=>setRecordForm({...recordForm, date: e.target.value})} />
                      <textarea placeholder="聯絡紀錄內容..." className="col-span-2 text-sm px-2 py-1.5 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16" value={recordForm.content || ''} onChange={e=>setRecordForm({...recordForm, content: e.target.value})}></textarea>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setRecordFormType(null)} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1">取消</button>
                      <button onClick={() => handleSaveRecord(selectedClient.id)} disabled={!recordForm.content} className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-1 rounded transition-colors">儲存</button>
                    </div>
                  </div>
                )}

                {selectedClient.logs.length > 0 ? (
                  <div className="relative pl-4 border-l-2 border-blue-100 ml-2 space-y-4">
                    {selectedClient.logs.map((log, idx) => (
                      <div key={idx} className="relative group pt-1">
                        <div className="absolute -left-[21px] top-2.5 w-3 h-3 bg-blue-400 rounded-full border-2 border-white"></div>
                        <button onClick={() => handleDeleteRecord(selectedClient.id, 'logs', idx)} className="absolute top-0 right-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 bg-slate-50 rounded" title="刪除紀錄"><Trash2 className="w-4 h-4"/></button>
                        <div className="text-sm pr-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-blue-600">{log.date}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium border border-slate-200">
                              {log.type}
                            </span>
                          </div>
                          <div className="text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100">
                            {log.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-400 italic pl-6">尚無聯絡紀錄</p>}
              </div>

            </div>
          </div>
        </div>
      )}

      {isAddingClient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col border border-slate-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                {editingClientId ? <Edit className="w-5 h-5 text-indigo-600" /> : <UserPlus className="w-5 h-5 text-emerald-600" />}
                {editingClientId ? '編輯客戶資料' : '新增客戶'}
              </h3>
              <button 
                onClick={() => { setIsAddingClient(false); setEditingClientId(null); setNewClientForm({ name: '', type: '買方', level: 'B', phone: '', lineId: '', note: '' }); }} 
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleClientSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">客戶姓名 <span className="text-red-500">*</span></label>
                <input required type="text" value={newClientForm.name} onChange={e => setNewClientForm({...newClientForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="例如：王小明" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客戶類型</label>
                  <select value={newClientForm.type} onChange={e => setNewClientForm({...newClientForm, type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="買方">買方</option>
                    <option value="賣方">賣方</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">客戶等級</label>
                  <select value={newClientForm.level} onChange={e => setNewClientForm({...newClientForm, level: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="A">A 級 (高意願)</option>
                    <option value="B">B 級 (需經營)</option>
                    <option value="C">C 級 (潛在/冷)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">電話</label>
                  <input type="text" value={newClientForm.phone} onChange={e => setNewClientForm({...newClientForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="09XX-XXX-XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Line ID</label>
                  <input type="text" value={newClientForm.lineId} onChange={e => setNewClientForm({...newClientForm, lineId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Line ID" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">需求備註</label>
                <textarea value={newClientForm.note} onChange={e => setNewClientForm({...newClientForm, note: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20" placeholder="簡單描述客戶需求、預算或物件條件..."></textarea>
              </div>
              
              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => { setIsAddingClient(false); setEditingClientId(null); setNewClientForm({ name: '', type: '買方', level: 'B', phone: '', lineId: '', note: '' }); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  取消
                </button>
                <button type="submit" disabled={!newClientForm.name.trim()} className={`px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors ${editingClientId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  <Save className="w-4 h-4" /> {editingClientId ? '儲存變更' : '儲存客戶'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
