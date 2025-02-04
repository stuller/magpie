import * as React from 'react'
import {Drawer, List, ListItemButton, ListItemIcon} from "@mui/material";
import {Calculate, Home, HomeRepairService, Logout, Diamond} from "@mui/icons-material";


interface IProps {
    signOut: () => void;
}
const Nav: React.FC<IProps> = (props:IProps) => {
    const {signOut} = props;
    return (
        <Drawer open={true} hideBackdrop={true} variant="permanent">
            <img src='/magpie-bw.svg' alt='' className="logo"/>
            <List component="nav" sx={{ maxWidth: 320, minWidth: '250px' }}>
                <ListItemButton href="/">
                    <ListItemIcon>
                        <Home/>
                    </ListItemIcon>
                    Home
                </ListItemButton>
                <ListItemButton href="/projects">
                    <ListItemIcon>
                        <Diamond/>
                    </ListItemIcon>
                    Projects
                </ListItemButton>
                <ListItemButton href="/supplies">
                    <ListItemIcon>
                        <HomeRepairService/>
                    </ListItemIcon>
                    Supplies
                </ListItemButton>
                <ListItemButton href="/calculators">
                    <ListItemIcon>
                        <Calculate/>
                    </ListItemIcon>
                    Calculators
                </ListItemButton>
                <ListItemButton onClick={signOut}>
                    <ListItemIcon>
                        <Logout/>
                    </ListItemIcon>
                    Sign Out
                </ListItemButton>
            </List>
        </Drawer>
    )
}

export default Nav;