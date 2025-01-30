import {Button, Modal, ModalClose, ModalDialog, FormControl, Typography, FormLabel, Input, styled} from '@mui/joy';
import * as React from 'react';
import {uploadData} from "aws-amplify/storage";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../amplify/data/resource.ts";

interface IProps {
    isOpen: boolean;
    handleClose: () => void;

}

const client = generateClient<Schema>({
    authMode: "userPool",
});


//TODO move this somewhere it can be shared
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const CreateSupplyModal:React.FC<IProps> = (props:IProps) => {
    const {isOpen, handleClose} = props;
    const [name, setName] = React.useState<string>('');
    const [type, setType] = React.useState<string>('');
    const [unit, setUnit] = React.useState<string>('');
    const [material, setMaterial] = React.useState<string>('');
    const [gauge, setGauge] = React.useState<number>();
    const [length, setLength] = React.useState<number>();
    const [width, setWidth] = React.useState<number>();
    const [cost, setCost] = React.useState<number>();
    const [image, setImage] = React.useState<File>();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setImage(event.target.files[0]);
        }

    }


    const createSupply= async () => {
        const {data: newSupply} = await client.models.Supply.create({
            cost,
            gauge,
            length,
            material,
            name,
            type,
            unit,
            width,
            image: image?.name ?? null,
        });
        console.log(newSupply);
        if (newSupply?.image && image) {
            await uploadData({
                path: ({identityId}) => `media/${identityId}/${newSupply.image}`,
                data: image ?? null,
            }).result;
        }

        handleClose();
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <ModalDialog>
                <ModalClose />
                <Typography level="h2">Create New Supply</Typography>
                <FormControl required>
                    <FormLabel>Name</FormLabel>
                    <Input
                        name="name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Type</FormLabel>
                    <Input
                        name="type"
                        type="text"
                        onChange={(e) => setType(e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Unit</FormLabel>
                    <Input
                        name="unit"
                        type="text"
                        onChange={(e) => setUnit(e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Material</FormLabel>
                    <Input
                        name="material"
                        type="text"
                        onChange={(e) => setMaterial(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Gauge</FormLabel>
                    <Input
                        name="gauge"
                        type="number"
                        onChange={(e) => setGauge(+e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Length</FormLabel>
                    <Input
                        name="length"
                        type="number"
                        onChange={(e) => setLength(+e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Width</FormLabel>
                    <Input
                        name="width"
                        type="number"
                        onChange={(e) => setWidth(+e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Cost</FormLabel>
                    <Input
                        name="cost"
                        type="number"
                        onChange={(e) => setCost(+e.target.value)}
                    />
                </FormControl>
                <FormControl required>
                    <FormLabel>Image</FormLabel>
                    <VisuallyHiddenInput
                        name="image"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <Button variant="solid" color="primary">
                        Choose File
                    </Button>
                </FormControl>
                <Button onClick={createSupply}>Submit</Button>
            </ModalDialog>
        </Modal>
    )
};

export default CreateSupplyModal;