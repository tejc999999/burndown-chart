import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

function LineGraphInput() {
  const [input, setInput] = useState('');
  const [dataPoints, setDataPoints] = useState([]);
  const [yMax, setYMax] = useState(100);
  const [yMaxInput, setYMaxInput] = useState('100');

  // 編集用状態
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // 数値入力変更
  const handleChange = (e) => setInput(e.target.value);

  // 縦軸最大値入力変更
  const handleYMaxChange = (e) => setYMaxInput(e.target.value);

  // 縦軸最大値確定
  const applyYMax = () => {
    const num = Number(yMaxInput);
    if (!isNaN(num) && num > 0) {
      setYMax(num);
    }
  };

  // データ追加（最大14点まで）
  const handleAdd = () => {
    const num = Number(input);
    if (!isNaN(num)) {
      let newData = [...dataPoints, num];
      if (newData.length > 12) {
        newData = newData.slice(newData.length - 12); // 最新12点保持
      }
      setDataPoints(newData);
      setInput('');
    }
  };

  // 編集開始
  const startEdit = (index) => {
    setEditIndex(index);
    setEditValue(dataPoints[index].toString());
  };

  // 編集値変更
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // 編集保存
  const saveEdit = () => {
    const num = Number(editValue);
    if (!isNaN(num)) {
      const newData = [...dataPoints];
      newData[editIndex] = num;
      setDataPoints(newData);
      setEditIndex(null);
      setEditValue('');
    }
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditIndex(null);
    setEditValue('');
  };

  // 横軸ラベル固定12点
  const labels = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // データを12点に埋める（nullで埋める）
  const displayData =
    dataPoints.length < 12
      ? Array(12 - dataPoints.length).fill(null).concat(dataPoints)
      : dataPoints.length > 12
      ? dataPoints.slice(dataPoints.length - 12)
      : dataPoints;

  const data = {
    labels,
    datasets: [
      {
        label: '入力数値の折れ線グラフ',
        data: displayData,
        fill: false,
        borderColor: 'blue',
        spanGaps: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: yMax,
      },
    },
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 新規数値追加 */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="number"
          value={input}
          onChange={handleChange}
          placeholder="数値を入力"
          style={{ marginRight: 10 }}
        />
        <button onClick={handleAdd}>追加</button>
      </div>

      {/* 縦軸最大値設定 */}
      <div style={{ marginBottom: 20 }}>
        <label>
          縦軸最大値設定：
          <input
            type="number"
            value={yMaxInput}
            onChange={handleYMaxChange}
            style={{ width: 80, marginLeft: 8, marginRight: 8 }}
          />
        </label>
        <button onClick={applyYMax}>適用</button>
      </div>

      {/* 折れ線グラフ */}
      <div style={{ maxWidth: 600 }}>
        <Line data={data} options={options} />
      </div>

      {/* データ点一覧と編集 */}
      <div style={{ marginTop: 20, maxWidth: 600 }}>
        <h3>データ点一覧（クリックで編集）</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>番号</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>値</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((val, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{idx + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: 8, cursor: 'pointer' }}>
                  {editIndex === idx ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={handleEditChange}
                      style={{ width: 80 }}
                    />
                  ) : (
                    <span onClick={() => startEdit(idx)}>{val}</span>
                  )}
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {editIndex === idx ? (
                    <>
                      <button onClick={saveEdit} style={{ marginRight: 8 }}>
                        保存
                      </button>
                      <button onClick={cancelEdit}>キャンセル</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(idx)}>編集</button>
                  )}
                </td>
              </tr>
            ))}
            {dataPoints.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 8, textAlign: 'center' }}>
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LineGraphInput;