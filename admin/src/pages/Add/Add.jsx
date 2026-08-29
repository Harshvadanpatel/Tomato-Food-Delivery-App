import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({ url }) => {

    const [image, setImage] = useState(false);

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "salad"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData(data => ({
            ...data,
            [name]: value
        }))
    }

    const onSubmitHandler = async (event) => {

        event.preventDefault();

        try {

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);

            const token = localStorage.getItem("adminToken");

            const response = await axios.post(
                `${url}/api/food/add`,
                formData,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {

                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "salad"
                });

                setImage(false);

                toast.success(response.data.message);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }

    return (
        <div className='add'>

            <form className='flex-col' onSubmit={onSubmitHandler}>

                <div className="add-img-upload flex-col">

                    <p>Upload Image</p>

                    <label htmlFor="image">
                        <img
                            src={
                                image
                                    ? URL.createObjectURL(image)
                                    : assets.upload_area
                            }
                            alt=""
                        />
                    </label>

                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
                    />

                </div>

                <div className="add-product-name flex-col">

                    <p>Product name</p>

                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        name='name'
                        type="text"
                        id="name"
                        placeholder='Type here'
                        required
                    />

                </div>

                <div className="add-product-description flex-col">

                    <p>Product description</p>

                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder='Write content here'
                        required
                    />

                </div>

                <div className="add-category-price">

                    <div className="add-category flex-col">

                        <p>Product category</p>

                        <select
                            onChange={onChangeHandler}
                            value={data.category}
                            name="category"
                        >

                            <option value="salad">Salad</option>
                            <option value="rolls">Rolls</option>
                            <option value="deserts">Deserts</option>
                            <option value="sandwich">Sandwich</option>
                            <option value="cake">Cake</option>
                            <option value="pure veg">Pure Veg</option>
                            <option value="pasta">Pasta</option>
                            <option value="noodles">Noodles</option>

                        </select>

                    </div>

                    <div className="add-price flex-col">

                        <p>Product price</p>

                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name="price"
                            placeholder='₹20'
                            required
                        />

                    </div>

                </div>

                <button type="submit" className='add-btn'>
                    Add
                </button>

            </form>

        </div>
    )
}

export default Add