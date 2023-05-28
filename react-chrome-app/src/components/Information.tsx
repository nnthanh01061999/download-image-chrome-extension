import React from 'react';

interface Props {
    total: number;
    totalSelected: number;
}

function Information(props: Props) {
    const { total, totalSelected } = props;
    return (
        <div className='information'>
            <div className='information__total'>
                <p className='information__label'>Total: </p>
                <p className='information__value'>{total}</p>
            </div>
            <div className='information__selected'>
                <p className='information__label'>Selected: </p>
                <p className='information__value'>{totalSelected}</p>
            </div>
        </div>
    );
}

export default Information;
