import { Engine } from "@rocketfuel/core/engine";
import { Transform } from "@rocketfuel/core/math";
import { INode, SingleChildNode } from "@rocketfuel/core/nodes";
import { TextNode } from "@rocketfuel/core/sdf";
import { ITextItem } from "@rocketfuel/core/text";
import { Asserts, IJSONObject, JSONUtil } from "@rocketfuel/core/util";
import { IVoice } from "../locale/IVoice";
import { KoreanVoice } from "../locale/KoreanVoice";
import { GameFlow } from "./GameFlow";
import { NumberGenerator } from "./NumberGenerator";

export class GameNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): GameNode
	{
		const nodeConfig = JSONUtil.AsType< IGameNodeConfig >( config );
		const child = engine.NodeFactory.Create( engine, nodeConfig.Child );
		return new GameNode( engine, child );
	}

	private flow?: GameFlow;
	private running: boolean = false;

	/**
	 *
	 */
	public constructor( engine: Engine, child: INode )
	{
		super( "GameNode" );
		this.SetChild( child );

		// TextNode
		const gameText = [ "NumberSinoText", "NumberNativeText", "TimeText", "DateText", "MoneyText", "SequenceText" ];
		const empty = engine.TextManager.Get( "Empty" );
		const textNode = this.FindNode( "GameText" ) as TextNode;
		Asserts.AssertNotNull( textNode );

		const setTextNode = ( text: ITextItem ) => textNode.SetText( text );
		const noText = () => setTextNode( empty );

		const category = engine.DataManager.GetRead( "value", "Category:Index" );
		const type = engine.DataManager.GetRead( "value", "Type:Index" );
		const difficulty = engine.DataManager.GetRead( "value", "Difficulty:Index" );
		const delay = engine.DataManager.GetRead( "value", "Delay:Value" );

		const generator = new NumberGenerator( engine );
		const reset = () =>
		{
			noText();
			generator.Randomize();
		};

		const voice = new KoreanVoice( engine, "Cindy" );
		const speak = () => this.Speak( engine, voice, category.Get(), difficulty.Get() );
		const noop = () => 0;

		engine.EventManager.Subscribe( "Game:Play", () =>
		{
			generator.SetOptions( category.Get(), difficulty.Get() );
			reset();

			const setText = () => { setTextNode( engine.TextManager.Get( gameText[ category.Get() ] ) ); };
			const gameType = type.Get();
			const gameDelay = 0.5 + 5 * delay.Get();

			// Listen, Speak
			this.flow = new GameFlow( reset, [
				{
					text: ( gameType !== 0 ) ? setText : noText,
					voice: ( gameType !== 1 ) ? speak : noop,
					delay: gameDelay,
				},
				{
					text: setText,
					voice: ( gameType === 1 ) ? speak : noop,
					delay: ( gameType !== 1 ) ? 2 : 1,
				},
			] );
			this.running = true;
		} );
		engine.EventManager.Subscribe( "Game:Stop", () => this.running = false );
	}

	/**
	 * @override
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		super.Update( deltaTime, transform, color );

		if( this.running )
		{
			this.flow?.Update( deltaTime );
		}
	}

	/**
	 *
	 */
	private Speak( engine: Engine, voice: IVoice, category: number, difficulty: number ): number
	{
		const data = ( name: string ): number => engine.DataManager.GetRead( "value", name ).Get();

		switch( category )
		{
			case 0: // Sino
				return voice.SayNumber( data( "Game:NumberSino" ), false );

			case 1: // Native
				return voice.SayNumber( data( "Game:NumberNative" ), true );

			case 2: // Time
				return voice.SayTime( data( "Game:TimeHours" ), data( "Game:TimeMinutes" ) );

			case 3: // Date
				return voice.SayDate( data( "Game:DateYear" ), data( "Game:DateMonth" ), data( "Game:DateDay" ) );

			case 4: // Money
				return voice.SayMoney( data( "Game:Money" ) );

			case 5: // Sequence
				return voice.SaySequence( [ data( "Game:Sequence0" ), data( "Game:Sequence1" ), data( "Game:Sequence2" ), data( "Game:Sequence3" ) ], difficulty );

			default:
				return 0;
		}
	}
}

export interface IGameNodeConfig
{
	Name: string;
	Child: IJSONObject;
}
