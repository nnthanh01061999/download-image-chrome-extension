import { ChangeEvent } from 'react';

interface TabProps {
    value: string;
    onChange: (value: string) => void;
}

function Tab(props: TabProps) {
    const { value, onChange } = props;

    const onChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange(value);
    };
    return (
        <div className='tab'>
            <input
                type='radio'
                name='tab'
                value='image'
                id='tab-1'
                checked={value === 'image'}
                onChange={onChangeRadio}
            />
            <label htmlFor='tab-1' className='tab__1'>
                <p>Image</p>
            </label>
            <input
                type='radio'
                name='tab'
                value='video'
                id='tab-2'
                checked={value === 'video'}
                onChange={onChangeRadio}
            />
            <label htmlFor='tab-2' className='tab__2'>
                <p>Video</p>
            </label>
            <div className='tab__color'></div>
        </div>
    );
}

export default Tab;
