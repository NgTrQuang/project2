// xử lý dữ liệu địa chỉ đầu vào toàn quốc

import React, { useState, useEffect } from 'react';
// import { Alert, FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography } from '@mui/material';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
// import RootService from '../../services/root.service';

const AddressSelector = () => {
    const { user, setUser } = useUserContext();

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');
    // const [phoneNumberError, setPhoneNumberError] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [addressData, setAddressData] = useState(null);

    useEffect(() => {
        console.log(user);

        // Tải dữ liệu từ API
        fetch('https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tree.json')
        .then((response) => response.json())
        .then((data) => {
            // Biến đổi dữ liệu thành cấu trúc phù hợp cho AddressSelector
            const transformedData = transformDataForAddressSelector(data, selectedProvince, selectedDistrict);
            setAddressData(transformedData);
            // console.log(transformedData['92']);
        })
        .catch((error) => {
            console.error('Lỗi khi tải dữ liệu từ API: ', error);
        });
    }, [selectedProvince, selectedDistrict]); // Chạy một lần khi component được tạo

    // Hàm biến đổi dữ liệu từ API thành cấu trúc dữ liệu phù hợp cho AddressSelector
    const transformDataForAddressSelector = (inputData, selectedProvince, selectedDistrict) => {
        const transformedData = { ...inputData };
    
        if (selectedProvince) {
        // Lọc các tỉnh/thành phố
        transformedData[selectedProvince] = { ...inputData[selectedProvince] };
    
        console.log("selectedProvince " + selectedProvince)
        if (selectedDistrict) {
            // Lọc các quận/huyện
            transformedData[selectedProvince][selectedDistrict] = { ...inputData[selectedProvince][selectedDistrict] };
        }
        console.log("selectedProvince ", typeof selectedProvince);
        console.log("selectedDistrict ", typeof selectedDistrict);
        console.log("selectedWard ",typeof selectedWard);
        console.log("addressData ",typeof addressData);
        // console.log(addressData[selectedProvince]["code"]);
        // console.log(addressData[selectedProvince]["quan-huyen"][selectedDistrict]["code"]);
        // console.log(addressData[selectedProvince]["quan-huyen"][selectedDistrict]["xa-phuong"][selectedWard]["code"]);
    }
  
    return transformedData;
    };

    // Lấy danh sách tỉnh/thành phố
    const provinces = addressData ? Object.values(addressData) : [];

    // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
    const getDistricts = (selectedProvince, addressData) => {
        if (selectedProvince && addressData[selectedProvince] && addressData[selectedProvince]['quan-huyen']) {
        return Object.values(addressData[selectedProvince]['quan-huyen']);
        }
        return [];
    };
  
    // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
    const getWards = (selectedProvince, selectedDistrict, addressData) => {
        if (selectedProvince && selectedDistrict && addressData[selectedProvince] && addressData[selectedProvince]['quan-huyen'][selectedDistrict] && addressData[selectedProvince]['quan-huyen'][selectedDistrict]['xa-phuong']) {
        return Object.values(addressData[selectedProvince]['quan-huyen'][selectedDistrict]['xa-phuong']);
        }
        return [];
    };
  
    // Sử dụng hàm để lấy danh sách quận/huyện và xã/phường
    const districts = getDistricts(selectedProvince, addressData);
    const wards = getWards(selectedProvince, selectedDistrict, addressData);
  
    // const handlePhoneNumberChange = (value) => {
    //     setPhoneNumber(value);
    
    //     // Kiểm tra số điện thoại với regex
    //     const phoneNumberRegex = /^\d+$/;
    //     if (!phoneNumberRegex.test(value)) {
    //         setPhoneNumberError('Số điện thoại chỉ được chứa các chữ số.');
    //     } else {
    //         setPhoneNumberError(null); // Xóa lỗi nếu số điện thoại hợp lệ
    //     }
    // }

    const handleSubmit = async () => {
        let shippingAddress = {};
        if(specificAddress === ''){
            setError("Lối khi nhập dữ liệu hãy kiểm tra và thử lại.");
            return;
        }

        if (addressData && selectedProvince && selectedDistrict && selectedWard) {
            shippingAddress = {
                provinceSwap: addressData[selectedProvince] ? addressData[selectedProvince]["name"] : '',
                districtSwap: addressData[selectedProvince]["quan-huyen"][selectedDistrict]["name"],
                wardSwap: addressData[selectedProvince]["quan-huyen"][selectedDistrict]["xa-phuong"][selectedWard]["name"],
                addressName: addressData[selectedProvince]["quan-huyen"][selectedDistrict]["xa-phuong"][selectedWard]["path_with_type"]
            };
            // Tạo một đối tượng địa chỉ để gửi lên API
            const addressRequest = {
                address: `${specificAddress}, ${shippingAddress.addressName}`
            };
            try {
                const response = await axios.put('http://localhost:3000/api/users/me', addressRequest,
                    {
                        headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust this if your token is stored differently
                        }
                    }
                    );
                console.log("Địa chỉ đã được tạo: ", response.data);
                setSuccess('Địa chỉ đã được cập nhật thành công.');
                setError(null);
                setUser(response.data);
            }
            catch (error) {
                console.error("Lỗi khi tạo địa chỉ: ", error);
                setError("Vui lòng chọn đầy đủ thông tin địa chỉ trước khi lưu.");
            };
        } else {
            console.log("Vui lòng chọn đầy đủ thông tin địa chỉ trước khi lưu.");
        }
    };

    return (
        <>
        <h4 className="text-lg font-medium text-gray-800 mb-4">Thay đổi địa chỉ nhận hàng của bạn</h4>
        
        <div className="mb-4">
            <label className="block text-gray-700">Tỉnh/Thành phố</label>
            <select
                className="w-full px-3 py-2 border rounded"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
            >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                    <option key={province?.code} value={province?.code}>
                        {province?.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700">Quận/Huyện</label>
            <select
                className="w-full px-3 py-2 border rounded"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
            >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                    <option key={district?.code} value={district?.code}>
                        {district?.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700">Phường/Xã</label>
            <select
                className="w-full px-3 py-2 border rounded"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
            >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                    <option key={ward?.code} value={ward?.code}>
                        {ward?.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700">Địa chỉ cụ thể</label>
            <input
                className="w-full px-3 py-2 border rounded"
                type="text"
                value={specificAddress}
                onChange={(e) => setSpecificAddress(e.target.value)}
            />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        
        <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={handleSubmit}
        >
            Lưu
        </button>
    </>
    );
};

export default AddressSelector;