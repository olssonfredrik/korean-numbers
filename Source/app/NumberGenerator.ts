import { DataManager } from "@rocketfuel/core/data";
import { Engine } from "@rocketfuel/core/engine";
import { NumberGeneratorFunctions } from "./NumberGeneratorFunctions";

export class NumberGenerator
{
	private difficulty: number = 0;
	private category: number = 0;
	private data: DataManager;

	/**
	 *
	 */
	public constructor( engine: Engine )
	{
		this.data = engine.DataManager;
	}

	/**
	 *
	 */
	public SetOptions( category: number, difficulty: number ): void
	{
		this.category = category;
		this.difficulty = difficulty;
	}

	/**
	 *
	 */
	public Randomize(): void
	{
		const functionList =
		[
			NumberGeneratorFunctions.RandomizeNumberSino,
			NumberGeneratorFunctions.RandomizeNumberNative,
			NumberGeneratorFunctions.RandomizeTime,
			NumberGeneratorFunctions.RandomizeDate,
			NumberGeneratorFunctions.RandomizeMoney,
			NumberGeneratorFunctions.RandomizeSequence,
		];
		const numberFunc = functionList[ this.category ];
		let done = false;
		while( !done )
		{
			const data = numberFunc( this.difficulty );
			done = this.SetData( data );
		}
	}

	/**
	 *
	 */
	private SetData( newData: Array< { Name: string, Value: number } > ): boolean
	{
		const isSame = newData.every( ( d ) => this.data.GetRead( "value", d.Name ).Get() === d.Value );
		if( !isSame )
		{
			newData.forEach( ( d ) => this.data.GetWrite( "value", d.Name ).Set( d.Value ) );
		}
		return !isSame;
	}
}
