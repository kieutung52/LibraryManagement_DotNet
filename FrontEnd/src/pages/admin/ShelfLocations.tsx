import React, { useEffect, useState, FormEvent } from 'react';
import { shelfService } from '../../services/deployment/shelfService';
import { ShelfResponse, ShelfStatus } from '../../types/typeEntity';
import { CreateShelfRequest, UpdateShelfRequest } from '../../types/typeRequest';

// Modal component (đơn giản)
const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
      <div className="p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
        {children}
      </div>
    </div>
  </div>
);

// Form Kệ
const ShelfForm = ({
  shelf,
  onSubmit,
  onClose
}: {
  shelf?: ShelfResponse | null,
  onSubmit: (data: CreateShelfRequest | UpdateShelfRequest) => Promise<void>,
  onClose: () => void
}) => {
  const [locationName, setLocationName] = useState(shelf?.locationName || '');
  const [description, setDescription] = useState(shelf?.description || '');
  const [capacity, setCapacity] = useState(shelf?.capacity || 50);
  const [status, setStatus] = useState<string>(shelf ? ShelfStatus[shelf.status] : 'EMPTY'); // Gửi string
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (shelf) {
        // Update
        const data: UpdateShelfRequest = {
          locationName,
          description: description || undefined,
          capacity,
          status,
        };
        await onSubmit(data);
      } else {
        // Create
        const data: CreateShelfRequest = {
          locationName,
          description: description || undefined,
          capacity,
        };
        await onSubmit(data);
      }
    } catch (err) {
      console.error(err);
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{shelf ? 'Sửa Kệ sách' : 'Thêm Kệ sách mới'}</h2>
      <input type="text" placeholder="Tên vị trí (Ví dụ: Kệ A1)" value={locationName} onChange={e => setLocationName(e.target.value)} required className="w-full p-2 border rounded" />
      <textarea placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
      <input type="number" placeholder="Sức chứa" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min="1" required className="w-full p-2 border rounded" />
      
      {/* Trường Status chỉ hiển thị khi Edit */}
      {shelf && (
        <select value={status} onChange={e => setStatus(e.target.value)} required className="w-full p-2 border rounded">
          <option value="EMPTY">Trống (EMPTY)</option>
          <option value="OCCUPIED">Đang dùng (OCCUPIED)</option>
          <option value="FULL">Đầy (FULL)</option>
        </select>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export const AdminShelfLocations = () => {
  const [shelves, setShelves] = useState<ShelfResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShelf, setEditingShelf] = useState<ShelfResponse | null>(null);

  const statusMap: Record<number, string> = {
    [ShelfStatus.EMPTY]: 'Trống',
    [ShelfStatus.OCCUPIED]: 'Đang dùng',
    [ShelfStatus.FULL]: 'Đầy',
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await shelfService.getAllShelves();
      setShelves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingShelf(null);
    setShowModal(true);
  };

  const handleOpenEdit = (shelf: ShelfResponse) => {
    setEditingShelf(shelf);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa kệ này? (Nếu kệ có sách, sẽ bị lỗi)')) {
      try {
        await shelfService.deleteShelf(id);
        await loadData();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleSubmitForm = async (data: CreateShelfRequest | UpdateShelfRequest) => {
    if (editingShelf) {
      await shelfService.updateShelf(editingShelf.shelfID, data as UpdateShelfRequest);
    } else {
      await shelfService.createShelf(data as CreateShelfRequest);
    }
    await loadData();
    setShowModal(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Kệ sách</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-black text-white rounded-lg">Thêm kệ mới</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Tên Kệ</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Mô tả</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Sức chứa</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {shelves.map(shelf => (
              <tr key={shelf.shelfID}>
                <td className="p-4">{shelf.locationName}</td>
                <td className="p-4">{shelf.description || '-'}</td>
                <td className="p-4">{statusMap[shelf.status]}</td>
                <td className="p-4">{shelf.capacity}</td>
                <td className="p-4">
                  <button onClick={() => handleOpenEdit(shelf)} className="text-sm text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDelete(shelf.shelfID)} className="text-sm text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ShelfForm
            shelf={editingShelf}
            onSubmit={handleSubmitForm}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
