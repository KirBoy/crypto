import React from 'react';
import {NavLink} from "react-router-dom";
import {Outlet} from "react-router";

const Navigation = () => {
    return (
        <div className='main'>
            <nav className='navigation'>
                <NavLink to='converter'
                         className={({isActive}) =>
                             isActive ? 'navigation__link active' : 'navigation__link'
                         }
                >
                    Конвертер
                </NavLink>
                <NavLink className='navigation__link' to='criptopack'>Криптопортфель</NavLink>
            </nav>
            <Outlet/>
        </div>
    );
};

export default Navigation;