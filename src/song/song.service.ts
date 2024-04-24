import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISong } from 'src/song/interface/song.interface';

@Injectable()
export class SongService {
  constructor(@InjectModel('Song') private readonly songModel:Model<ISong>) {}

  async addSong(createSongDto: CreateSongDto): Promise<ISong> {
    const newSong = await new this.songModel(createSongDto);
    return newSong.save();
  }

  async updateSong(id: string, updateSongDto: UpdateSongDto): Promise<ISong> {
    const song = await this.songModel.findByIdAndUpdate(id, updateSongDto, {
      new: true,
    })

    if (!song) {
      throw new NotFoundException(`Song with id #${id} not found`);
    }
    return song;
  }

  async getAllSongs(): Promise<ISong[]> {
    const songData = await this.songModel.find();
    if (!songData || songData.length == 0) {
      throw new NotFoundException('Song data not found!');
    }
    return songData;
  }

  async getSong(id: string): Promise<ISong> {
    const song: ISong = await this.songModel.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with id #${id} not found`);
    }
    return song;
  }

  async deleteSong(id: string): Promise<ISong> {
    const song = await this.songModel.findByIdAndDelete(id);
    if (!song) {
      throw new NotFoundException(`Song with id #${id} not found`);
    }
    return song;
  }
}
