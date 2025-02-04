import * as React from 'react';
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../amplify/data/resource.ts";
import {
    Button, Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormLabel,
    Grid2,
    Input,
    TextField
} from "@mui/material";

interface IProps {
    isOpen: boolean;
    handleClose: () => void;
}

const client = generateClient<Schema>({
    authMode: "userPool",
});

const CreateProjectModal: React.FC<IProps> = (props:IProps) => {
    const {isOpen, handleClose} = props;
    const [name, setName] = React.useState<string>('test');
    const [description, setDescription] = React.useState<string>('test description');

    const createProject= async () => {
        await client.models.Project.create({
            name,
            description,
        });
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent>
                <Grid2 container spacing={4} direction="column" size={12}>
                    <Grid2 container spacing={3} size={12}>
                        <Grid2 size={12}>
                            <FormControl required fullWidth>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    name="name"
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={12}>
                            <FormControl required fullWidth>
                                <FormLabel>Description</FormLabel>
                                <TextField
                                    name="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    multiline
                                    fullWidth
                                    rows={4}
                                />
                            </FormControl>
                        </Grid2>
                    </Grid2>
                    <Divider sx={{margin: '2em 0'}}/>
                    <Grid2 container sx={{
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={createProject} variant="contained">Submit</Button>
                    </Grid2>

                </Grid2>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProjectModal;