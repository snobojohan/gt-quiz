import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function QuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0
  });

  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);


  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
    console.log('Current Coordinates:', coordinates);
  }, [coordinates]);


  const questions = [

    { text: 'Stoppa vinster i välfärden | Fler privata företag inom vård och skola', type: 'horizontal' },
    { text: 'Avskaffa monarkin | Hedra konungen', type: 'vertical' },
    { text: 'Brottsförebyggande sociala åtgärder | Hårdare straff', type: 'vertical' },
    { text: 'Klimatet är viktigast | Tillväxten får inte hotas', type: 'vertical' },
    { text: 'Återinför en förmögenhetsskatt | Sänk alla skatter', type: 'horizontal' },
    { text: 'Gratis offentlig sjukvård | Privatisera fler offentliga tjänster', type: 'horizontal' },
    { text: 'Förstärk den offentliga sektorn | Företagens frihet är viktigast', type: 'horizontal' },
    { text: 'Öppna gränser för invandring | Strängare gränskontroller', type: 'vertical' },
    { text: 'Jämställdhetskvotering i företagsstyrelser | Låt marknaden välja', type: 'vertical' },
    { text: 'Rättigheter för HBTQ+ personer | Traditionella familjevärden', type: 'vertical' },
    { text: 'Avkriminalisera droger och behandla missbruk | Nolltolerans mot droger', type: 'horizontal' }
  ];

  let leftText = '';
  let rightText = '';

  if (currentQuestion < questions.length) {
    [leftText, rightText] = questions[currentQuestion].text.split('|');
  }

  const steps = 3

  function handleSwipe(direction) {

    if (isProcessingSwipe) return;

    setIsProcessingSwipe(true);

    let questionType;
    try {
      // Get the type of the current question
      questionType = questions[currentQuestion].type;
    } catch (error) {
      // Swipe on the results page not allowed
      setIsProcessingSwipe(false);
      return;
    }


    // Check the type and the swipe direction
    if (questionType === 'horizontal' && (direction === 'up' || direction === 'down')) {
      // Don't do anything if it's a horizontal question and the swipe is vertical
      setIsProcessingSwipe(false);
      return;
    } else if (questionType === 'vertical' && (direction === 'left' || direction === 'right')) {
      // Don't do anything if it's a vertical question and the swipe is horizontal
      setIsProcessingSwipe(false);
      return;
    }
    switch (direction) {
      case 'left':
        setCoordinates(prev => ({
          ...prev,
          x: Math.max(-10, prev.x - steps)  // accumulate values with a limit
        }));
        break;
      case 'right':
        setCoordinates(prev => ({
          ...prev,
          x: Math.min(10, prev.x + steps)
        }));
        break;
      case 'up':
        setCoordinates(prev => ({
          ...prev,
          y: Math.min(10, prev.y + steps)
        }));
        break;
      case 'down':
        setCoordinates(prev => ({
          ...prev,
          y: Math.max(-10, prev.y - steps)
        }));
        break;
      default:
        break;
    }
    setCurrentQuestion(prev => prev + 1);

    setIsProcessingSwipe(false);
  }

  function handleMouseDown(event) {
    console.log('handleMouseDown');
    setMouseDownPosition({ x: event.clientX, y: event.clientY });
    setIsMouseDown(true);
  }

  function handleMouseUp(event) {

    console.log('handleMouseUp', !isMouseDown, !mouseDownPosition);

    if (!isMouseDown || !mouseDownPosition) return;

    const deltaX = event.clientX - mouseDownPosition.x;
    const deltaY = event.clientY - mouseDownPosition.y;

    console.log('deltaX:', deltaX);

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal movement
      if (deltaX > 30) handleSwipe('right');
      else if (deltaX < -30) handleSwipe('left');
    } else {
      // Vertical movement
      if (deltaY > 30) handleSwipe('down');
      else if (deltaY < -30) handleSwipe('up');
    }
    setIsMouseDown(false);
    setMouseDownPosition(null);
  }


  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    onSwipedUp: () => handleSwipe('up'),
    onSwipedDown: () => handleSwipe('down')
  });

  return (
    <div className="container"
      {...handlers}
      {...(!isTouchDevice ? {
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp
      } : {})}
    >
      <div className="wrapper">
        {currentQuestion < questions.length ? (
          <>
            {questions[currentQuestion].type === 'vertical' ? (
              <>
                <div className="text top">{leftText.trim()}</div>
              </>
            ) : (
              <>
                <div className="text left">{leftText.trim()}</div>
              </>
            )}
            <div className={`question-box ${questions[currentQuestion].type === 'horizontal' ? 'horizontal' : ''}`}

            >
              &nbsp;
            </div>
            {questions[currentQuestion].type === 'vertical' ? (
              <>
                <div className="text bottom">{rightText.trim()}</div>
              </>
            ) : (
              <>
                <div className="text right">{rightText.trim()}</div>
              </>
            )}
          </>
        ) : (
          <div className="results-section">
            <div className="text top result">Dansa, kramas och äta veganskt</div>
            <div className="text left result">Dela rättvist</div>
            <svg className="graph">
              {/* Horizontal Line */}
              <line className="horizontal-line" x1="0" y1="150" x2="300" y2="150" />
              {/* Vertical Line */}
              <line className="vertical-line" x1="150" y1="0" x2="150" y2="300" />
              {/* Point representing user's coordinates */}
              <circle
                className="point"
                cx={150 + (15 * coordinates.x)}
                cy={150 - (15 * coordinates.y)}
              />
            </svg>

            <div className="text bottom result">Håll käften, rätta dig i ledet</div>
            <div className="text right result">Älska att äga</div>
          </div>
        )}
      </div>
    </div>
  );
}
